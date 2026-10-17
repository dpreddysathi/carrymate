package com.carrymate.controller;

import com.carrymate.dto.PaymentDto;
import com.carrymate.dto.PaymentHoldInput;
import com.carrymate.service.PaymentService;
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
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Shopper pays the deal total into platform hold. Release/refund
     * happen automatically via deal confirm/cancel.
     */
    @PostMapping("/hold")
    public ResponseEntity<PaymentDto> hold(@Valid @RequestBody PaymentHoldInput in) {
        return ResponseEntity.status(201).body(paymentService.hold(in.getDealId()));
    }

    @GetMapping("/deal/{dealId}")
    public PaymentDto byDeal(@PathVariable Long dealId) {
        return paymentService.getByDeal(dealId);
    }
}
