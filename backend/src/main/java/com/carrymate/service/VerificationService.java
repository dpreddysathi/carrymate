package com.carrymate.service;

import com.carrymate.dto.VerificationDto;
import com.carrymate.dto.VerificationInput;
import com.carrymate.exception.ResourceNotFoundException;
import com.carrymate.exception.UnauthorizedException;
import com.carrymate.model.AppUser;
import com.carrymate.model.VerificationRequest;
import com.carrymate.model.VerificationStatus;
import com.carrymate.repository.AppUserRepository;
import com.carrymate.repository.VerificationRequestRepository;
import com.carrymate.security.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Traveler identity verification.
 *
 * <p>v1 note: there are no admin roles yet, so the approve/reject
 * endpoints are open to any logged-in user. This is a demo stub —
 * restrict them to an admin role before any production use.
 */
@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationRequestRepository verificationRepository;
    private final AppUserRepository userRepository;

    private AppUser me() {
        return userRepository.findById(AuthContext.currentUserId())
                .orElseThrow(() -> new UnauthorizedException("Login required"));
    }

    /** User submits an identity document reference for verification. */
    @Transactional
    public VerificationDto request(VerificationInput in) {
        AppUser user = me();
        VerificationRequest req = new VerificationRequest();
        req.setUser(user);
        req.setDocType(in.getDocType());
        req.setDocReference(in.getDocReference());
        req.setStatus(VerificationStatus.PENDING);
        user.setVerificationStatus(VerificationStatus.PENDING);
        userRepository.save(user);
        return VerificationDto.from(verificationRepository.save(req));
    }

    @Transactional(readOnly = true)
    public List<VerificationDto> mine() {
        return verificationRepository
                .findByUserIdOrderByCreatedAtDesc(AuthContext.currentUserId())
                .stream().map(VerificationDto::from).toList();
    }

    /** v1 stub: approves the request and marks the user verified. */
    @Transactional
    public VerificationDto approve(Long id) {
        VerificationRequest req = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VerificationRequest", id));
        req.setStatus(VerificationStatus.VERIFIED);
        req.setReviewedAt(LocalDateTime.now());
        AppUser user = req.getUser();
        user.setVerificationStatus(VerificationStatus.VERIFIED);
        user.setTravelerVerified(true);
        userRepository.save(user);
        return VerificationDto.from(verificationRepository.save(req));
    }

    /** v1 stub: rejects the request. */
    @Transactional
    public VerificationDto reject(Long id) {
        VerificationRequest req = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VerificationRequest", id));
        req.setStatus(VerificationStatus.REJECTED);
        req.setReviewedAt(LocalDateTime.now());
        AppUser user = req.getUser();
        user.setVerificationStatus(VerificationStatus.REJECTED);
        user.setTravelerVerified(false);
        userRepository.save(user);
        return VerificationDto.from(verificationRepository.save(req));
    }
}
