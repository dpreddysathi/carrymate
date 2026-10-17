package com.carrymate.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * What the traveler declares at customs for a deal, plus the
 * platform's ESTIMATED duty (see {@code DutyEstimator} — estimates
 * only, never legal advice).
 */
@Entity
@Table(name = "customs_declaration")
@Getter
@Setter
@NoArgsConstructor
public class CustomsDeclaration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "deal_id", unique = true)
    private Deal deal;

    @NotBlank(message = "items description is required")
    @Column(length = 2000)
    private String itemsDescription;

    @NotNull(message = "declared value is required")
    private BigDecimal declaredValue;

    private String currency = "INR";

    /** ESTIMATED duty, computed at creation time. */
    private BigDecimal estimatedDuty;

    /** Traveler confirms the declaration is truthful and complete. */
    private boolean travelerConfirmed = false;

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
