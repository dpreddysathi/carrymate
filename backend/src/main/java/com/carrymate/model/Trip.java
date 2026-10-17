package com.carrymate.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * A traveler's announced trip. Shoppers browse these to find someone
 * already flying the route they need a product carried on.
 */
@Entity
@Table(name = "trip")
@Getter
@Setter
@NoArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "traveler_id")
    private AppUser traveler;

    @NotBlank(message = "origin country is required")
    private String fromCountry;

    private String fromCity;

    @NotBlank(message = "destination country is required")
    private String toCountry;

    private String toCity;

    @NotNull(message = "departure date is required")
    private LocalDate departureDate;

    private LocalDate arrivalDate;

    /** Spare luggage capacity the traveler offers, in kg. */
    @PositiveOrZero(message = "available kg must be zero or more")
    private Double availableKg;

    /**
     * Comma-separated product categories the traveler is willing to
     * carry, e.g. "electronics,fashion,perfume".
     */
    private String categories;

    /** Commission the traveler asks, as a percent of product price. */
    @PositiveOrZero(message = "commission must be zero or more")
    private Double commissionPct;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status = TripStatus.OPEN;

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
