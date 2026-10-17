package com.carrymate.repository;

import com.carrymate.model.VerificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, Long> {

    List<VerificationRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<VerificationRequest> findFirstByUserIdAndStatusOrderByCreatedAtDesc(
            Long userId, com.carrymate.model.VerificationStatus status);
}
