package com.carrymate.controller;

import com.carrymate.dto.ReviewDto;
import com.carrymate.dto.ReviewInput;
import com.carrymate.dto.UserDto;
import com.carrymate.exception.ResourceNotFoundException;
import com.carrymate.model.AppUser;
import com.carrymate.repository.AppUserRepository;
import com.carrymate.service.ReviewService;
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
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final AppUserRepository userRepository;

    /** Leave a rating after a CONFIRMED deal (one per reviewer per deal). */
    @PostMapping("/api/reviews")
    public ResponseEntity<ReviewDto> create(@Valid @RequestBody ReviewInput in) {
        return ResponseEntity.status(201).body(reviewService.create(in));
    }

    /** Public profile of any user (traveler rating etc.). */
    @GetMapping("/api/users/{id}")
    public UserDto user(@PathVariable Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return UserDto.from(user);
    }

    /** Reviews received by a user. */
    @GetMapping("/api/users/{id}/reviews")
    public List<ReviewDto> reviews(@PathVariable Long id) {
        return reviewService.forUser(id);
    }
}
