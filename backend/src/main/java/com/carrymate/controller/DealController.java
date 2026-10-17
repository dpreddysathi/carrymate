package com.carrymate.controller;

import com.carrymate.dto.DealDto;
import com.carrymate.dto.DealProposeInput;
import com.carrymate.dto.DealStatusInput;
import com.carrymate.service.DealService;
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
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    /** Shopper proposes a deal: links their request to a trip. */
    @PostMapping
    public ResponseEntity<DealDto> propose(@Valid @RequestBody DealProposeInput in) {
        return ResponseEntity.status(201).body(dealService.propose(in));
    }

    /** My deals — as traveler or shopper. */
    @GetMapping
    public List<DealDto> myDeals() {
        return dealService.myDeals();
    }

    @GetMapping("/{id}")
    public DealDto get(@PathVariable Long id) {
        return dealService.get(id);
    }

    /** Traveler accepts a PROPOSED deal. */
    @PostMapping("/{id}/accept")
    public DealDto accept(@PathVariable Long id) {
        return dealService.accept(id);
    }

    /** Traveler declines a PROPOSED deal. */
    @PostMapping("/{id}/decline")
    public DealDto decline(@PathVariable Long id) {
        return dealService.decline(id);
    }

    /** Traveler advances: PURCHASED → IN_TRANSIT → DELIVERED (in order). */
    @PostMapping("/{id}/status")
    public DealDto advance(@PathVariable Long id,
                           @Valid @RequestBody DealStatusInput in) {
        return dealService.advance(id, in.getTo());
    }

    /** Shopper confirms delivery → escrow released, deal CONFIRMED. */
    @PostMapping("/{id}/confirm")
    public DealDto confirm(@PathVariable Long id) {
        return dealService.confirm(id);
    }

    /** Either party cancels; held money is refunded. */
    @PostMapping("/{id}/cancel")
    public DealDto cancel(@PathVariable Long id) {
        return dealService.cancel(id);
    }
}
