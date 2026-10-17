package com.carrymate.service;

import com.carrymate.dto.CustomsDto;
import com.carrymate.dto.CustomsInput;
import com.carrymate.exception.ResourceNotFoundException;
import com.carrymate.exception.UnauthorizedException;
import com.carrymate.model.CustomsDeclaration;
import com.carrymate.model.Deal;
import com.carrymate.model.DealStatus;
import com.carrymate.repository.CustomsDeclarationRepository;
import com.carrymate.repository.DealRepository;
import com.carrymate.security.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.EnumSet;

/**
 * Customs declarations. The traveler declares what they carry; the
 * platform computes an ESTIMATED duty for planning (see
 * {@link DutyEstimator}). Estimates are not legal advice — the
 * traveler is responsible for truthful declaration.
 */
@Service
@RequiredArgsConstructor
public class CustomsService {

    private static final EnumSet<DealStatus> DECLARABLE = EnumSet.of(
            DealStatus.ACCEPTED, DealStatus.PURCHASED,
            DealStatus.IN_TRANSIT, DealStatus.DELIVERED);

    private final CustomsDeclarationRepository customsRepository;
    private final DealRepository dealRepository;

    private Deal travelerDeal(Long dealId) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal", dealId));
        if (!deal.getTraveler().getId().equals(AuthContext.currentUserId())) {
            throw new UnauthorizedException("Only the traveler declares customs");
        }
        return deal;
    }

    private BigDecimal rateFor(Deal deal) {
        return DutyEstimator.rateUsed(
                deal.getTrip().getToCountry(),
                deal.getProductRequest().getCategory());
    }

    private CustomsDto toDto(CustomsDeclaration c) {
        return CustomsDto.from(c, rateFor(c.getDeal()));
    }

    /** Traveler files the declaration; duty is ESTIMATED server-side. */
    @Transactional
    public CustomsDto declare(CustomsInput in) {
        Deal deal = travelerDeal(in.getDealId());
        if (!DECLARABLE.contains(deal.getStatus())) {
            throw new IllegalStateException(
                    "Customs can only be declared on an active deal");
        }
        if (customsRepository.findByDealId(deal.getId()).isPresent()) {
            throw new IllegalStateException("Declaration already filed for this deal");
        }
        CustomsDeclaration c = new CustomsDeclaration();
        c.setDeal(deal);
        c.setItemsDescription(in.getItemsDescription().trim());
        c.setDeclaredValue(in.getDeclaredValue());
        c.setCurrency(in.getCurrency() == null || in.getCurrency().isBlank()
                ? "INR" : in.getCurrency().trim().toUpperCase());
        // ESTIMATE — computed, never taken from the client.
        c.setEstimatedDuty(DutyEstimator.estimate(
                deal.getTrip().getToCountry(),
                deal.getProductRequest().getCategory(),
                c.getDeclaredValue()));
        return toDto(customsRepository.save(c));
    }

    /** Traveler confirms the declaration is truthful and complete. */
    @Transactional
    public CustomsDto confirm(Long id) {
        CustomsDeclaration c = customsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomsDeclaration", id));
        travelerDeal(c.getDeal().getId());
        c.setTravelerConfirmed(true);
        return toDto(customsRepository.save(c));
    }

    @Transactional(readOnly = true)
    public CustomsDto byDeal(Long dealId) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal", dealId));
        Long me = AuthContext.currentUserId();
        if (!deal.getTraveler().getId().equals(me)
                && !deal.getShopper().getId().equals(me)) {
            throw new UnauthorizedException("Not your deal");
        }
        CustomsDeclaration c = customsRepository.findByDealId(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomsDeclaration for deal", dealId));
        return toDto(c);
    }
}
