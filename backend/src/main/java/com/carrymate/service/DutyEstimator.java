package com.carrymate.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

/**
 * Import-duty ESTIMATOR. These are rough flat rates for planning only —
 * real duty depends on the exact product, HS code, exemptions and the
 * assessing officer. Every figure this class produces is an ESTIMATE:
 * the traveler must verify with official customs sources and declare
 * truthfully.
 *
 * <p>Rates are expressed as a fraction of declared value, keyed by
 * destination country (ISO-ish uppercase name) and product category.
 */
public final class DutyEstimator {

    private DutyEstimator() {
    }

    private static final Map<String, Map<String, BigDecimal>> RATES = Map.of(
            // India: BCD + surcharges vary widely; these are conservative
            // planning ESTIMATES, not legal rates.
            "INDIA", Map.of(
                    "electronics", new BigDecimal("0.28"),
                    "fashion", new BigDecimal("0.20"),
                    "perfume", new BigDecimal("0.30"),
                    "other", new BigDecimal("0.25")),
            "USA", Map.of(
                    "electronics", new BigDecimal("0.00"),
                    "fashion", new BigDecimal("0.05"),
                    "perfume", new BigDecimal("0.05"),
                    "other", new BigDecimal("0.05")),
            "UAE", Map.of(
                    "electronics", new BigDecimal("0.05"),
                    "fashion", new BigDecimal("0.05"),
                    "perfume", new BigDecimal("0.05"),
                    "other", new BigDecimal("0.05")),
            "UK", Map.of(
                    "electronics", new BigDecimal("0.10"),
                    "fashion", new BigDecimal("0.12"),
                    "perfume", new BigDecimal("0.10"),
                    "other", new BigDecimal("0.10")));

    private static final BigDecimal DEFAULT_RATE = new BigDecimal("0.20");

    /**
     * Returns the ESTIMATED duty for a declared value. Never null.
     */
    public static BigDecimal estimate(String destinationCountry, String category,
                                      BigDecimal declaredValue) {
        if (declaredValue == null || declaredValue.signum() <= 0) {
            return BigDecimal.ZERO;
        }
        String country = destinationCountry == null ? ""
                : destinationCountry.trim().toUpperCase();
        String cat = category == null ? "other" : category.trim().toLowerCase();
        BigDecimal rate = RATES.getOrDefault(country, Map.of())
                .getOrDefault(cat, DEFAULT_RATE);
        return declaredValue.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    /** The ESTIMATED rate used, for display next to the figure. */
    public static BigDecimal rateUsed(String destinationCountry, String category) {
        String country = destinationCountry == null ? ""
                : destinationCountry.trim().toUpperCase();
        String cat = category == null ? "other" : category.trim().toLowerCase();
        return RATES.getOrDefault(country, Map.of()).getOrDefault(cat, DEFAULT_RATE);
    }
}
