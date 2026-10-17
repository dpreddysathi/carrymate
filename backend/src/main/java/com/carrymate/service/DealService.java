package com.carrymate.service;

import com.carrymate.dto.DealDto;
import com.carrymate.dto.DealProposeInput;
import com.carrymate.dto.PaymentDto;
import com.carrymate.exception.ResourceNotFoundException;
import com.carrymate.exception.UnauthorizedException;
import com.carrymate.model.Deal;
import com.carrymate.model.DealStatus;
import com.carrymate.model.ProductRequest;
import com.carrymate.model.RequestStatus;
import com.carrymate.model.Trip;
import com.carrymate.model.TripStatus;
import com.carrymate.repository.DealRepository;
import com.carrymate.repository.PaymentRepository;
import com.carrymate.repository.ProductRequestRepository;
import com.carrymate.repository.TripRepository;
import com.carrymate.security.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

/**
 * The deal state machine. Every transition is role-checked and
 * order-checked here — the controller is thin on purpose.
 *
 * <p>Flow: PROPOSED (shopper) → ACCEPTED (traveler) → PURCHASED
 * (traveler, needs payment HELD) → IN_TRANSIT → DELIVERED (traveler)
 * → CONFIRMED (shopper, releases payment). CANCELLED/DISPUTED end it.
 */
@Service
@RequiredArgsConstructor
public class DealService {

    /** Traveler-driven forward steps and where they may go from. */
    private static final Set<DealStatus> TRAVELER_ADVANCES =
            EnumSet.of(DealStatus.PURCHASED, DealStatus.IN_TRANSIT, DealStatus.DELIVERED);

    private static final Set<DealStatus> CANCELLABLE = EnumSet.of(
            DealStatus.PROPOSED, DealStatus.ACCEPTED,
            DealStatus.PURCHASED, DealStatus.IN_TRANSIT);

    private final DealRepository dealRepository;
    private final TripRepository tripRepository;
    private final ProductRequestRepository requestRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    private Deal visibleToMe(Long id) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal", id));
        Long me = AuthContext.currentUserId();
        if (!deal.getTraveler().getId().equals(me)
                && !deal.getShopper().getId().equals(me)) {
            throw new UnauthorizedException("Not your deal");
        }
        return deal;
    }

    private void requireTraveler(Deal deal) {
        if (!deal.getTraveler().getId().equals(AuthContext.currentUserId())) {
            throw new UnauthorizedException("Only the traveler can do this");
        }
    }

    private void requireShopper(Deal deal) {
        if (!deal.getShopper().getId().equals(AuthContext.currentUserId())) {
            throw new UnauthorizedException("Only the shopper can do this");
        }
    }

    private DealDto toDto(Deal deal) {
        PaymentDto payment = paymentRepository.findByDealId(deal.getId())
                .map(PaymentDto::from).orElse(null);
        return DealDto.from(deal, payment);
    }

    /** Shopper proposes a deal on their own OPEN request + an OPEN trip. */
    @Transactional
    public DealDto propose(DealProposeInput in) {
        Trip trip = tripRepository.findById(in.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip", in.getTripId()));
        ProductRequest req = requestRepository.findById(in.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Request", in.getRequestId()));
        if (!req.getShopper().getId().equals(AuthContext.currentUserId())) {
            throw new UnauthorizedException("You can only propose deals on your own requests");
        }
        if (req.getStatus() != RequestStatus.OPEN) {
            throw new IllegalStateException("Request is not open for deals");
        }
        if (trip.getStatus() != TripStatus.OPEN) {
            throw new IllegalStateException("Trip is not open for deals");
        }
        if (trip.getTraveler().getId().equals(req.getShopper().getId())) {
            throw new IllegalStateException("You cannot make a deal with yourself");
        }
        Deal deal = new Deal();
        deal.setTrip(trip);
        deal.setProductRequest(req);
        deal.setTraveler(trip.getTraveler());
        deal.setShopper(req.getShopper());
        deal.setAgreedProductPrice(in.getAgreedProductPrice());
        deal.setCommissionAmount(in.getCommissionAmount());
        deal.setCurrency(in.getCurrency() == null || in.getCurrency().isBlank()
                ? "INR" : in.getCurrency().trim().toUpperCase());
        deal.recordEvent(DealStatus.PROPOSED,
                "Shopper proposed: " + deal.getCurrency() + " "
                        + deal.totalAmount() + " total");
        req.setStatus(RequestStatus.MATCHED);
        requestRepository.save(req);
        return toDto(dealRepository.save(deal));
    }

    /** Traveler accepts the proposal. */
    @Transactional
    public DealDto accept(Long id) {
        Deal deal = visibleToMe(id);
        requireTraveler(deal);
        requireStatus(deal, DealStatus.PROPOSED);
        deal.recordEvent(DealStatus.ACCEPTED, "Traveler accepted the deal");
        return toDto(dealRepository.save(deal));
    }

    /** Traveler declines — the request goes back to OPEN. */
    @Transactional
    public DealDto decline(Long id) {
        Deal deal = visibleToMe(id);
        requireTraveler(deal);
        requireStatus(deal, DealStatus.PROPOSED);
        deal.recordEvent(DealStatus.CANCELLED, "Traveler declined the proposal");
        deal.getProductRequest().setStatus(RequestStatus.OPEN);
        return toDto(dealRepository.save(deal));
    }

    /**
     * Traveler moves the deal forward one step. PURCHASED additionally
     * requires the shopper's payment to be HELD in escrow first.
     */
    @Transactional
    public DealDto advance(Long id, DealStatus to) {
        Deal deal = visibleToMe(id);
        requireTraveler(deal);
        if (!TRAVELER_ADVANCES.contains(to)) {
            throw new IllegalArgumentException(
                    "Traveler can only advance to PURCHASED, IN_TRANSIT or DELIVERED");
        }
        DealStatus expected = switch (to) {
            case PURCHASED -> DealStatus.ACCEPTED;
            case IN_TRANSIT -> DealStatus.PURCHASED;
            case DELIVERED -> DealStatus.IN_TRANSIT;
            default -> throw new IllegalArgumentException("Invalid transition");
        };
        requireStatus(deal, expected);
        if (to == DealStatus.PURCHASED) {
            boolean held = paymentRepository.findByDealId(deal.getId())
                    .map(p -> p.getStatus()
                            == com.carrymate.model.PaymentStatus.HELD)
                    .orElse(false);
            if (!held) {
                throw new IllegalStateException(
                        "The shopper must hold payment in escrow before the product is purchased");
            }
        }
        deal.recordEvent(to, "Traveler marked " + to.name().toLowerCase().replace('_', ' '));
        return toDto(dealRepository.save(deal));
    }

    /**
     * Shopper confirms delivery — money is released to the traveler and
     * the deal is done.
     */
    @Transactional
    public DealDto confirm(Long id) {
        Deal deal = visibleToMe(id);
        requireShopper(deal);
        requireStatus(deal, DealStatus.DELIVERED);
        paymentService.release(deal);
        deal.recordEvent(DealStatus.CONFIRMED,
                "Shopper confirmed delivery; escrow released to traveler");
        deal.getProductRequest().setStatus(RequestStatus.CLOSED);
        return toDto(dealRepository.save(deal));
    }

    /** Either party cancels; a held payment is refunded to the shopper. */
    @Transactional
    public DealDto cancel(Long id) {
        Deal deal = visibleToMe(id);
        if (!CANCELLABLE.contains(deal.getStatus())) {
            throw new IllegalStateException(
                    "Deal can no longer be cancelled (status: " + deal.getStatus() + ")");
        }
        paymentService.refundIfHeld(deal);
        deal.recordEvent(DealStatus.CANCELLED, "Cancelled");
        if (deal.getProductRequest().getStatus() == RequestStatus.MATCHED) {
            deal.getProductRequest().setStatus(RequestStatus.OPEN);
        }
        return toDto(dealRepository.save(deal));
    }

    @Transactional(readOnly = true)
    public List<DealDto> myDeals() {
        return dealRepository.findMyDeals(AuthContext.currentUserId())
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public DealDto get(Long id) {
        return toDto(visibleToMe(id));
    }

    private static void requireStatus(Deal deal, DealStatus expected) {
        if (deal.getStatus() != expected) {
            throw new IllegalStateException("Deal must be " + expected
                    + " for this action (is " + deal.getStatus() + ")");
        }
    }
}
