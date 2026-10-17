package com.carrymate.controller;

import com.carrymate.dto.VerificationDto;
import com.carrymate.dto.VerificationInput;
import com.carrymate.service.VerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    /** Submit an identity document reference for verification. */
    @PostMapping("/request")
    public ResponseEntity<VerificationDto> request(
            @Valid @RequestBody VerificationInput in) {
        return ResponseEntity.status(201).body(verificationService.request(in));
    }

    /** My verification requests. */
    @GetMapping("/mine")
    public List<VerificationDto> mine() {
        return verificationService.mine();
    }

    /**
     * v1 stub — approves a request. No admin roles exist yet, so this is
     * open; restrict to admins before production use.
     */
    @PostMapping("/{id}/approve")
    public VerificationDto approve(@PathVariable Long id) {
        return verificationService.approve(id);
    }

    /** v1 stub — rejects a request (see approve note). */
    @PostMapping("/{id}/reject")
    public VerificationDto reject(@PathVariable Long id) {
        return verificationService.reject(id);
    }
}
