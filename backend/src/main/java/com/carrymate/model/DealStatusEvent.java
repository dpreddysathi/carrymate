package com.carrymate.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/** One entry in a deal's audit trail. */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DealStatusEvent {

    @Enumerated(EnumType.STRING)
    private DealStatus status;

    private LocalDateTime at;

    private String note;
}
