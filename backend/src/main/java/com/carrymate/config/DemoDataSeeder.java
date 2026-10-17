package com.carrymate.config;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.carrymate.model.AppUser;
import com.carrymate.model.CustomsDeclaration;
import com.carrymate.model.Deal;
import com.carrymate.model.DealStatus;
import com.carrymate.model.DealStatusEvent;
import com.carrymate.model.Payment;
import com.carrymate.model.PaymentStatus;
import com.carrymate.model.ProductRequest;
import com.carrymate.model.RequestStatus;
import com.carrymate.model.Trip;
import com.carrymate.model.TripStatus;
import com.carrymate.model.VerificationStatus;
import com.carrymate.repository.AppUserRepository;
import com.carrymate.repository.CustomsDeclarationRepository;
import com.carrymate.repository.DealRepository;
import com.carrymate.repository.PaymentRepository;
import com.carrymate.repository.ProductRequestRepository;
import com.carrymate.repository.TripRepository;
import com.carrymate.service.DutyEstimator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Demo data for local development. Runs once on startup when
 * {@code app.demo-seed=true} (the default) and the database is empty.
 *
 * <p>Demo logins (password {@code demo1234}):
 * <ul>
 *   <li>priya@example.com — verified traveler</li>
 *   <li>arjun@example.com — shopper</li>
 * </ul>
 */
@Component
@ConditionalOnProperty(name = "app.demo-seed", havingValue = "true", matchIfMissing = true)
public class DemoDataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final AppUserRepository users;
    private final TripRepository trips;
    private final ProductRequestRepository requests;
    private final DealRepository deals;
    private final PaymentRepository payments;
    private final CustomsDeclarationRepository customs;

    public DemoDataSeeder(AppUserRepository users, TripRepository trips,
                          ProductRequestRepository requests, DealRepository deals,
                          PaymentRepository payments,
                          CustomsDeclarationRepository customs) {
        this.users = users;
        this.trips = trips;
        this.requests = requests;
        this.deals = deals;
        this.payments = payments;
        this.customs = customs;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (users.count() > 0) {
            return; // already seeded (or real data exists)
        }
        AppUser priya = user("Priya Sharma", "priya@example.com", "98765 43210");
        priya.setTravelerVerified(true);
        priya.setVerificationStatus(VerificationStatus.VERIFIED);
        priya.setRatingAvg(4.8);
        priya.setRatingCount(12);
        users.save(priya);

        AppUser arjun = user("Arjun Mehta", "arjun@example.com", "98111 22334");
        users.save(arjun);

        Trip nyc = trip(priya, "India", "Hyderabad", "USA", "New York",
                LocalDate.now().plusDays(10), LocalDate.now().plusDays(11),
                8.0, "electronics,fashion", 8.0);
        trips.save(nyc);
        Trip dubai = trip(priya, "India", "Delhi", "UAE", "Dubai",
                LocalDate.now().plusDays(20), LocalDate.now().plusDays(20),
                5.0, "perfume,fashion,electronics", 10.0);
        trips.save(dubai);

        ProductRequest sneakers = request(arjun, "Nike Air Jordan 1 Retro",
                "US size 10, any colorway", "USA", "New York",
                new BigDecimal("18000"), "INR", "fashion", "Hyderabad", "India");
        requests.save(sneakers);
        requests.save(request(arjun, "iPhone 16 Pro 256GB",
                "Natural titanium, sealed box", "USA", "New York",
                new BigDecimal("110000"), "INR", "electronics", "Hyderabad", "India"));
        requests.save(request(arjun, "Dior Sauvage EDP 100ml",
                "Sealed, batch code visible", "UAE", "Dubai",
                new BigDecimal("9500"), "INR", "perfume", "Delhi", "India"));

        // One deal already in transit: sneakers on the Hyderabad→New York trip.
        Deal deal = new Deal();
        deal.setTrip(nyc);
        deal.setProductRequest(sneakers);
        deal.setTraveler(priya);
        deal.setShopper(arjun);
        deal.setAgreedProductPrice(new BigDecimal("16500"));
        deal.setCommissionAmount(new BigDecimal("1320")); // 8%
        deal.setCurrency("INR");
        deal.setStatus(DealStatus.IN_TRANSIT);
        deal.setEvents(new java.util.ArrayList<>(List.of(
                new DealStatusEvent(DealStatus.PROPOSED, LocalDateTime.now().minusDays(3),
                        "Shopper proposed: INR 17820 total"),
                new DealStatusEvent(DealStatus.ACCEPTED, LocalDateTime.now().minusDays(3),
                        "Traveler accepted the deal"),
                new DealStatusEvent(DealStatus.PURCHASED, LocalDateTime.now().minusDays(1),
                        "Traveler marked purchased"),
                new DealStatusEvent(DealStatus.IN_TRANSIT, LocalDateTime.now().minusHours(5),
                        "Traveler marked in transit"))));
        deals.save(deal);
        sneakers.setStatus(RequestStatus.MATCHED);
        requests.save(sneakers);

        Payment payment = new Payment();
        payment.setDeal(deal);
        payment.setAmount(deal.totalAmount());
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.HELD);
        payment.setGatewayRef("MOCK-HOLD-DEMO1");
        payments.save(payment);

        CustomsDeclaration cd = new CustomsDeclaration();
        cd.setDeal(deal);
        cd.setItemsDescription("1x Nike Air Jordan 1 Retro sneakers (US 10)");
        cd.setDeclaredValue(new BigDecimal("16500"));
        cd.setCurrency("INR");
        cd.setEstimatedDuty(DutyEstimator.estimate("USA", "fashion", new BigDecimal("16500")));
        cd.setTravelerConfirmed(true);
        customs.save(cd);

        log.info("CarryMate demo data seeded. Log in with priya@example.com / demo1234"
                + " (traveler) or arjun@example.com / demo1234 (shopper).");
    }

    private static AppUser user(String name, String email, String phone) {
        AppUser u = new AppUser();
        u.setName(name);
        u.setEmail(email);
        u.setPhone(phone);
        u.setPasswordHash(BCrypt.withDefaults().hashToString(12, "demo1234".toCharArray()));
        return u;
    }

    private static Trip trip(AppUser traveler, String fromCountry, String fromCity,
                             String toCountry, String toCity, LocalDate dep, LocalDate arr,
                             double kg, String categories, double commissionPct) {
        Trip t = new Trip();
        t.setTraveler(traveler);
        t.setFromCountry(fromCountry);
        t.setFromCity(fromCity);
        t.setToCountry(toCountry);
        t.setToCity(toCity);
        t.setDepartureDate(dep);
        t.setArrivalDate(arr);
        t.setAvailableKg(kg);
        t.setCategories(categories);
        t.setCommissionPct(commissionPct);
        t.setStatus(TripStatus.OPEN);
        return t;
    }

    private static ProductRequest request(AppUser shopper, String name, String desc,
                                          String buyCountry, String buyCity, BigDecimal maxPrice,
                                          String currency, String category,
                                          String deliverCity, String deliverCountry) {
        ProductRequest r = new ProductRequest();
        r.setShopper(shopper);
        r.setProductName(name);
        r.setDescription(desc);
        r.setBuyCountry(buyCountry);
        r.setBuyCity(buyCity);
        r.setMaxPrice(maxPrice);
        r.setCurrency(currency);
        r.setQuantity(1);
        r.setCategory(category);
        r.setDeliverCity(deliverCity);
        r.setDeliverCountry(deliverCountry);
        r.setStatus(RequestStatus.OPEN);
        return r;
    }
}
