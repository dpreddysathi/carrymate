package com.carrymate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class TripInput {

    @NotBlank(message = "origin country is required")
    private String fromCountry;

    private String fromCity;

    @NotBlank(message = "destination country is required")
    private String toCountry;

    private String toCity;

    @NotNull(message = "departure date is required")
    private LocalDate departureDate;

    private LocalDate arrivalDate;

    @PositiveOrZero(message = "available kg must be zero or more")
    private Double availableKg;

    private String categories;

    @PositiveOrZero(message = "commission must be zero or more")
    private Double commissionPct;
}
