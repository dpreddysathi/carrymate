package com.carrymate.controller;

import com.carrymate.dto.CustomsDto;
import com.carrymate.dto.CustomsInput;
import com.carrymate.service.CustomsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customs")
@RequiredArgsConstructor
public class CustomsController {

    private final CustomsService customsService;

    /**
     * Traveler files the customs declaration. The response includes the
     * platform's ESTIMATED duty — a planning figure only.
     */
    @PostMapping
    public ResponseEntity<CustomsDto> declare(@Valid @RequestBody CustomsInput in) {
        return ResponseEntity.status(201).body(customsService.declare(in));
    }

    /** Traveler confirms the declaration is truthful and complete. */
    @PostMapping("/{id}/confirm")
    public CustomsDto confirm(@PathVariable Long id) {
        return customsService.confirm(id);
    }

    @GetMapping("/deal/{dealId}")
    public CustomsDto byDeal(@PathVariable Long dealId) {
        return customsService.byDeal(dealId);
    }
}
