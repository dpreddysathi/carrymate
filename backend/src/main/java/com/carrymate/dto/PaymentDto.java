package com.carrymate.dto;

import com.carrymate.model.Payment;
import com.carrymate.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/** Escrow record — the gateway ref proves the mock/real hold. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private Long id;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String gatewayRef;

    public static PaymentDto from(Payment p) {
        return new PaymentDto(p.getId(), p.getAmount(), p.getCurrency(),
                p.getStatus(), p.getGatewayRef());
    }
}
