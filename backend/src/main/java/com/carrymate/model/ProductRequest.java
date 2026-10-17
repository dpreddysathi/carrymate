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
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A shopper's request for a product to be carried from another
 * country (or city, for domestic routes).
 */
@Entity
@Table(name = "product_request")
@Getter
@Setter
@NoArgsConstructor
public class ProductRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shopper_id")
    private AppUser shopper;

    @NotBlank(message = "product name is required")
    private String productName;

    @Column(length = 2000)
    private String description;

    /** Country the product should be bought in. */
    @NotBlank(message = "buy country is required")
    private String buyCountry;

    private String buyCity;

    /** Most the shopper will pay for the product itself. */
    @NotNull(message = "max price is required")
    private BigDecimal maxPrice;

    private String currency = "INR";

    @Min(value = 1, message = "quantity must be at least 1")
    private int quantity = 1;

    /** electronics / fashion / perfume / other … */
    private String category = "other";

    private String deliverCity;

    private String deliverCountry;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.OPEN;

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
