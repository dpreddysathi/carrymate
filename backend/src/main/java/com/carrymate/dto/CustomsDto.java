package com.carrymate.dto;

import com.carrymate.model.CustomsDeclaration;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Customs declaration. The duty figure is an ESTIMATE for planning —
 * the traveler must verify real rates with official customs sources.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomsDto {

    private Long id;
    private Long dealId;
    private String itemsDescription;
    private BigDecimal declaredValue;
    private String currency;
    /** ESTIMATE — not the real duty. */
    private BigDecimal estimatedDuty;
    private BigDecimal estimateRate;
    private boolean travelerConfirmed;

    public static CustomsDto from(CustomsDeclaration c, BigDecimal rate) {
        return new CustomsDto(c.getId(), c.getDeal().getId(),
                c.getItemsDescription(), c.getDeclaredValue(), c.getCurrency(),
                c.getEstimatedDuty(), rate, c.isTravelerConfirmed());
    }
}
