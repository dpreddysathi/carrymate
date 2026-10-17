package com.carrymate.dto;

import com.carrymate.model.DealStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Traveler advances the deal: PURCHASED, IN_TRANSIT or DELIVERED. */
@Getter
@Setter
@NoArgsConstructor
public class DealStatusInput {

    @NotNull(message = "target status is required")
    private DealStatus to;
}
