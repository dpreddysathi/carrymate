package com.carrymate.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class RequestInput {

    @NotBlank(message = "product name is required")
    private String productName;

    private String description;

    @NotBlank(message = "buy country is required")
    private String buyCountry;

    private String buyCity;

    @NotNull(message = "max price is required")
    private BigDecimal maxPrice;

    private String currency = "INR";

    @Min(value = 1, message = "quantity must be at least 1")
    private int quantity = 1;

    private String category = "other";

    private String deliverCity;

    private String deliverCountry;

    private String imageUrl;
}
