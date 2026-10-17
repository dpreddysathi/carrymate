package com.carrymate.repository;

import com.carrymate.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);

    boolean existsByDealIdAndReviewerId(Long dealId, Long reviewerId);
}
