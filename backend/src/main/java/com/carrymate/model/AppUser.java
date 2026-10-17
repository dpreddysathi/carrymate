package com.carrymate.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * A login account. One user can be a traveler, a shopper, or both —
 * there are no separate roles; what you can do depends on the trips
 * and requests you own.
 *
 * <p>Table is {@code app_user} because {@code user} is a reserved word
 * in H2 / Postgres.
 */
@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "name is required")
    private String name;

    /** Login email — stored lowercase, unique. */
    @Column(nullable = false, unique = true)
    private String email;

    /** BCrypt hash — the raw password is never stored. */
    @Column(nullable = false)
    private String passwordHash;

    private String phone;

    /** True once an identity document has been approved. */
    private boolean travelerVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.NONE;

    /** Average of all Review ratings received. */
    private double ratingAvg = 0.0;

    private int ratingCount = 0;

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
