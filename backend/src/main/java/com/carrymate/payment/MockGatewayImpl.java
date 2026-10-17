package com.carrymate.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Development gateway: no real money moves. Every operation is logged
 * and returns a synthetic reference. The deal state machine runs
 * exactly as it would against a real provider.
 */
@Service
public class MockGatewayImpl implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(MockGatewayImpl.class);

    @Override
    public String hold(Long dealId, BigDecimal amount, String currency) {
        String ref = "MOCK-HOLD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("[mock-gateway] HOLD deal={} amount={} {} ref={}", dealId, amount, currency, ref);
        return ref;
    }

    @Override
    public String release(Long dealId, String holdRef, BigDecimal amount, String currency) {
        String ref = "MOCK-REL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("[mock-gateway] RELEASE deal={} holdRef={} amount={} {} ref={}",
                dealId, holdRef, amount, currency, ref);
        return ref;
    }

    @Override
    public String refund(Long dealId, String holdRef, BigDecimal amount, String currency) {
        String ref = "MOCK-REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("[mock-gateway] REFUND deal={} holdRef={} amount={} {} ref={}",
                dealId, holdRef, amount, currency, ref);
        return ref;
    }
}
