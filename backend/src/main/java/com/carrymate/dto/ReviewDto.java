package com.carrymate.dto;

import com.carrymate.model.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {

    private Long id;
    private Long dealId;
    private UserDto reviewer;
    private UserDto reviewee;
    private int rating;
    private String comment;

    public static ReviewDto from(Review r) {
        return new ReviewDto(r.getId(), r.getDeal().getId(),
                UserDto.from(r.getReviewer()), UserDto.from(r.getReviewee()),
                r.getRating(), r.getComment());
    }
}
