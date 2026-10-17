package com.carrymate.payment;

import java.math.BigDecimal;

/**
 * Escrow operations against a real payment provider.
 *
 * <p>v1 ships with {@link MockGatewayImpl}, which only logs and moves
 * the local Payment row through its states — enough to exercise the
 * whole deal flow end to end. To go live, implement this interface with
 * Razorpay / Stripe (hold = authorize/capture-on-release, release =
 * transfer to traveler, refund = refund to shopper) and mark the
 * implementation {@code @Primary}.
 */
public interface PaymentGateway {

    /**
     * Moves the shopper's money into platform hold.
     *
     * @return gateway-side reference for the hold
     */
    String hold(Long dealId, BigDecimal amount, String currency);

    /** Pays the held money out to the traveler. */
    String release(Long dealId, String holdRef, BigDecimal amount, String currency);

    /** Returns the held money to the shopper. */
    String refund(Long dealId, String holdRef, BigDecimal amount, String currency);
}
