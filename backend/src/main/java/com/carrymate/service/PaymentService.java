package com.carrymate.service;

import com.carrymate.dto.PaymentDto;
import com.carrymate.exception.ResourceNotFoundException;
import com.carrymate.exception.UnauthorizedException;
import com.carrymate.model.Deal;
import com.carrymate.model.Payment;
import com.carrymate.model.PaymentStatus;
import com.carrymate.payment.PaymentGateway;
import com.carrymate.repository.DealRepository;
import com.carrymate.repository.PaymentRepository;
import com.carrymate.security.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Escrow lifecycle. Money is held when the shopper pays, released to
 * the traveler when the shopper confirms delivery, refunded to the
 * shopper if the deal is cancelled. The actual money movement goes
 * through the configured {@link PaymentGateway} (mock in v1).
 */
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final DealRepository dealRepository;
    private final PaymentGateway gateway;

    private Deal dealVisibleToMe(Long dealId) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal", dealId));
        Long me = AuthContext.currentUserId();
        if (!deal.getTraveler().getId().equals(me)
                && !deal.getShopper().getId().equals(me)) {
            throw new UnauthorizedException("Not your deal");
        }
        return deal;
    }

    /** Shopper pays the deal total into platform hold. */
    @Transactional
    public PaymentDto hold(Long dealId) {
        Deal deal = dealVisibleToMe(dealId);
        if (!deal.getShopper().getId().equals(AuthContext.currentUserId())) {
            throw new UnauthorizedException("Only the shopper can pay");
        }
        if (deal.getStatus() != com.carrymate.model.DealStatus.ACCEPTED) {
            throw new IllegalStateException(
                    "Payment can only be held once the traveler accepts the deal");
        }
        if (paymentRepository.findByDealId(dealId).isPresent()) {
            throw new IllegalStateException("Payment already held for this deal");
        }
        String ref = gateway.hold(dealId, deal.totalAmount(), deal.getCurrency());
        Payment payment = new Payment();
        payment.setDeal(deal);
        payment.setAmount(deal.totalAmount());
        payment.setCurrency(deal.getCurrency());
        payment.setStatus(PaymentStatus.HELD);
        payment.setGatewayRef(ref);
        return PaymentDto.from(paymentRepository.save(payment));
    }

    /** Called by deal confirmation — pays the traveler out. */
    @Transactional
    public PaymentDto release(Deal deal) {
        Payment payment = paymentRepository.findByDealId(deal.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "No held payment for this deal"));
        if (payment.getStatus() != PaymentStatus.HELD) {
            throw new IllegalStateException(
                    "Payment is not held (status: " + payment.getStatus() + ")");
        }
        String ref = gateway.release(deal.getId(), payment.getGatewayRef(),
                payment.getAmount(), payment.getCurrency());
        payment.setStatus(PaymentStatus.RELEASED);
        payment.setGatewayRef(ref);
        return PaymentDto.from(paymentRepository.save(payment));
    }

    /** Called by deal cancellation — returns money to the shopper. */
    @Transactional
    public void refundIfHeld(Deal deal) {
        paymentRepository.findByDealId(deal.getId()).ifPresent(payment -> {
            if (payment.getStatus() == PaymentStatus.HELD) {
                String ref = gateway.refund(deal.getId(), payment.getGatewayRef(),
                        payment.getAmount(), payment.getCurrency());
                payment.setStatus(PaymentStatus.REFUNDED);
                payment.setGatewayRef(ref);
                paymentRepository.save(payment);
            }
        });
    }

    @Transactional(readOnly = true)
    public PaymentDto getByDeal(Long dealId) {
        dealVisibleToMe(dealId);
        Payment payment = paymentRepository.findByDealId(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment for deal", dealId));
        return PaymentDto.from(payment);
    }
}
