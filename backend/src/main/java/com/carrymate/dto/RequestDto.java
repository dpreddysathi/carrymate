package com.carrymate.dto;

import com.carrymate.model.ProductRequest;
import com.carrymate.model.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/** Product request with its shopper attached. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestDto {

    private Long id;
    private UserDto shopper;
    private String productName;
    private String description;
    private String buyCountry;
    private String buyCity;
    private BigDecimal maxPrice;
    private String currency;
    private int quantity;
    private String category;
    private String deliverCity;
    private String deliverCountry;
    private String imageUrl;
    private RequestStatus status;

    public static RequestDto from(ProductRequest r) {
        return new RequestDto(r.getId(), UserDto.from(r.getShopper()),
                r.getProductName(), r.getDescription(), r.getBuyCountry(), r.getBuyCity(),
                r.getMaxPrice(), r.getCurrency(), r.getQuantity(), r.getCategory(),
                r.getDeliverCity(), r.getDeliverCountry(), r.getImageUrl(), r.getStatus());
    }
}
