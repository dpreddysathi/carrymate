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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * A traveler's identity-verification request. v1 stores only a document
 * REFERENCE (e.g. "passport ••••1234 shown on video call") — never the
 * document file itself.
 */
@Entity
@Table(name = "verification_request")
@Getter
@Setter
@NoArgsConstructor
public class VerificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocType docType;

    /** Reference only — e.g. last 4 digits + how it was checked. */
    private String docReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status = VerificationStatus.PENDING;

    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
