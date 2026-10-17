package com.carrymate.model;

/**
 * Escrow states. Money is HELD when the shopper pays, RELEASED to the
 * traveler on delivery confirmation, REFUNDED to the shopper on cancel.
 */
public enum PaymentStatus {
    HELD,
    RELEASED,
    REFUNDED
}
