package com.carrymate.model;

/**
 * Deal lifecycle. Normal flow: PROPOSED → ACCEPTED → PURCHASED →
 * IN_TRANSIT → DELIVERED → CONFIRMED. CANCELLED/DISPUTED are terminal
 * side-states.
 */
public enum DealStatus {
    PROPOSED,
    ACCEPTED,
    PURCHASED,
    IN_TRANSIT,
    DELIVERED,
    CONFIRMED,
    CANCELLED,
    DISPUTED
}
