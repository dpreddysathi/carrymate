package com.carrymate.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/** Shopper proposes a deal linking their request to a trip. */
@Getter
@Setter
@NoArgsConstructor
public class DealProposeInput {

    @NotNull(message = "tripId is required")
    private Long tripId;

    @NotNull(message = "requestId is required")
    private Long requestId;

    @NotNull(message = "agreed product price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "price must be positive")
    private BigDecimal agreedProductPrice;

    @NotNull(message = "commission amount is required")
    @DecimalMin(value = "0.0", message = "commission must be zero or more")
    private BigDecimal commissionAmount;

    private String currency = "INR";
}
