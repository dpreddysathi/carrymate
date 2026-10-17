package com.carrymate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class CustomsInput {

    @NotNull(message = "dealId is required")
    private Long dealId;

    @NotBlank(message = "items description is required")
    private String itemsDescription;

    @NotNull(message = "declared value is required")
    private BigDecimal declaredValue;

    private String currency = "INR";
}
