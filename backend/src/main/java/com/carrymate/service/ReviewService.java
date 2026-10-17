package com.carrymate.service;

import com.carrymate.dto.ReviewDto;
import com.carrymate.dto.ReviewInput;
import com.carrymate.exception.ResourceNotFoundException;
import com.carrymate.exception.UnauthorizedException;
import com.carrymate.model.AppUser;
import com.carrymate.model.Deal;
import com.carrymate.model.DealStatus;
import com.carrymate.model.Review;
import com.carrymate.repository.AppUserRepository;
import com.carrymate.repository.DealRepository;
import com.carrymate.repository.ReviewRepository;
import com.carrymate.security.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Post-deal ratings. Both sides can review after CONFIRMED, once per
 * reviewer per deal. The reviewee's average rating is maintained here.
 */
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DealRepository dealRepository;
    private final AppUserRepository userRepository;

    @Transactional
    public ReviewDto create(ReviewInput in) {
        Deal deal = dealRepository.findById(in.getDealId())
                .orElseThrow(() -> new ResourceNotFoundException("Deal", in.getDealId()));
        if (deal.getStatus() != DealStatus.CONFIRMED) {
            throw new IllegalStateException("Reviews are only allowed after delivery is confirmed");
        }
        Long me = AuthContext.currentUserId();
        AppUser reviewee;
        if (deal.getTraveler().getId().equals(me)) {
            reviewee = deal.getShopper();
        } else if (deal.getShopper().getId().equals(me)) {
            reviewee = deal.getTraveler();
        } else {
            throw new UnauthorizedException("Not your deal");
        }
        if (reviewRepository.existsByDealIdAndReviewerId(deal.getId(), me)) {
            throw new IllegalStateException("You have already reviewed this deal");
        }
        AppUser reviewer = userRepository.findById(me)
                .orElseThrow(() -> new UnauthorizedException("Login required"));
        Review review = new Review();
        review.setDeal(deal);
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setRating(in.getRating());
        review.setComment(in.getComment());
        reviewRepository.save(review);
        // Maintain the running average.
        int count = reviewee.getRatingCount();
        double avg = reviewee.getRatingAvg();
        reviewee.setRatingCount(count + 1);
        reviewee.setRatingAvg((avg * count + in.getRating()) / (count + 1));
        userRepository.save(reviewee);
        return ReviewDto.from(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> forUser(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId)
                .stream().map(ReviewDto::from).toList();
    }
}
