package com.carrymate.service;

import com.carrymate.dto.TripDto;
import com.carrymate.dto.TripInput;
import com.carrymate.exception.ResourceNotFoundException;
import com.carrymate.exception.UnauthorizedException;
import com.carrymate.model.AppUser;
import com.carrymate.model.Trip;
import com.carrymate.model.TripStatus;
import com.carrymate.repository.AppUserRepository;
import com.carrymate.repository.TripRepository;
import com.carrymate.security.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Trip CRUD. Only the trip's owner can edit or cancel it; anyone
 * logged in can search open trips.
 */
@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final AppUserRepository userRepository;

    private AppUser me() {
        return userRepository.findById(AuthContext.currentUserId())
                .orElseThrow(() -> new UnauthorizedException("Login required"));
    }

    private Trip owned(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", id));
        if (!trip.getTraveler().getId().equals(AuthContext.currentUserId())) {
            throw new UnauthorizedException("Only the trip owner can change it");
        }
        return trip;
    }

    private void apply(Trip trip, TripInput in) {
        trip.setFromCountry(in.getFromCountry().trim());
        trip.setFromCity(in.getFromCity());
        trip.setToCountry(in.getToCountry().trim());
        trip.setToCity(in.getToCity());
        trip.setDepartureDate(in.getDepartureDate());
        trip.setArrivalDate(in.getArrivalDate());
        trip.setAvailableKg(in.getAvailableKg());
        trip.setCategories(in.getCategories());
        trip.setCommissionPct(in.getCommissionPct());
    }

    @Transactional
    public TripDto create(TripInput in) {
        Trip trip = new Trip();
        trip.setTraveler(me());
        apply(trip, in);
        trip.setStatus(TripStatus.OPEN);
        return TripDto.from(tripRepository.save(trip));
    }

    @Transactional(readOnly = true)
    public List<TripDto> myTrips() {
        return tripRepository.findByTravelerIdOrderByDepartureDateAsc(
                AuthContext.currentUserId()).stream().map(TripDto::from).toList();
    }

    @Transactional(readOnly = true)
    public List<TripDto> search(String from, String to, LocalDate date) {
        return tripRepository.search(TripStatus.OPEN,
                blankToNull(from), blankToNull(to), date).stream()
                .map(TripDto::from).toList();
    }

    @Transactional(readOnly = true)
    public TripDto get(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", id));
        return TripDto.from(trip);
    }

    @Transactional
    public TripDto update(Long id, TripInput in) {
        Trip trip = owned(id);
        if (trip.getStatus() != TripStatus.OPEN) {
            throw new IllegalStateException("Only OPEN trips can be edited");
        }
        apply(trip, in);
        return TripDto.from(tripRepository.save(trip));
    }

    @Transactional
    public TripDto cancel(Long id) {
        Trip trip = owned(id);
        trip.setStatus(TripStatus.CANCELLED);
        return TripDto.from(tripRepository.save(trip));
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
