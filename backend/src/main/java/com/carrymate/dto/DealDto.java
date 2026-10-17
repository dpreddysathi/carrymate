package com.carrymate.dto;

import com.carrymate.model.Deal;
import com.carrymate.model.DealStatus;
import com.carrymate.model.DealStatusEvent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Deal with trip, request, both parties, timeline and payment state. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DealDto {

    private Long id;
    private TripDto trip;
    private RequestDto productRequest;
    private UserDto traveler;
    private UserDto shopper;
    private BigDecimal agreedProductPrice;
    private BigDecimal commissionAmount;
    private BigDecimal totalAmount;
    private String currency;
    private DealStatus status;
    private List<DealStatusEvent> events;
    private PaymentDto payment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static DealDto from(Deal d, PaymentDto payment) {
        return new DealDto(d.getId(), TripDto.from(d.getTrip()),
                RequestDto.from(d.getProductRequest()),
                UserDto.from(d.getTraveler()), UserDto.from(d.getShopper()),
                d.getAgreedProductPrice(), d.getCommissionAmount(), d.totalAmount(),
                d.getCurrency(), d.getStatus(), d.getEvents(), payment,
                d.getCreatedAt(), d.getUpdatedAt());
    }
}
