package com.carrymate.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Shopper pays the deal total into platform hold. */
@Getter
@Setter
@NoArgsConstructor
public class PaymentHoldInput {

    @NotNull(message = "dealId is required")
    private Long dealId;
}
