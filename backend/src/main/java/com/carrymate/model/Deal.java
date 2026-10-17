package com.carrymate.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * A deal ties one trip to one product request. The traveler carries the
 * product; the shopper pays product price + commission. Money moves
 * through a held Payment released only on delivery confirmation.
 */
@Entity
@Table(name = "deal")
@Getter
@Setter
@NoArgsConstructor
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "request_id")
    private ProductRequest productRequest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "traveler_id")
    private AppUser traveler;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shopper_id")
    private AppUser shopper;

    /** Agreed price of the product itself. */
    @NotNull
    private BigDecimal agreedProductPrice;

    /** Traveler's commission for carrying it. */
    @NotNull
    private BigDecimal commissionAmount;

    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DealStatus status = DealStatus.PROPOSED;

    /** Full audit trail of status changes. */
    @ElementCollection
    @CollectionTable(name = "deal_status_event",
            joinColumns = @JoinColumn(name = "deal_id"))
    @OrderColumn(name = "seq")
    private List<DealStatusEvent> events = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /** Total the shopper pays into hold: product + commission. */
    public BigDecimal totalAmount() {
        return agreedProductPrice.add(commissionAmount);
    }

    public void recordEvent(DealStatus to, String note) {
        this.status = to;
        this.events.add(new DealStatusEvent(to, LocalDateTime.now(), note));
    }
}
