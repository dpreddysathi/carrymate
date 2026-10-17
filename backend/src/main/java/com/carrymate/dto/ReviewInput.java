package com.carrymate.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReviewInput {

    @NotNull(message = "dealId is required")
    private Long dealId;

    @Min(1)
    @Max(5)
    private int rating;

    private String comment;
}
