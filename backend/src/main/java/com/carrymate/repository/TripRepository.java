package com.carrymate.repository;

import com.carrymate.model.Trip;
import com.carrymate.model.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByTravelerIdOrderByDepartureDateAsc(Long travelerId);

    List<Trip> findByStatusOrderByDepartureDateAsc(TripStatus status);

    @Query("SELECT t FROM Trip t WHERE t.status = 'OPEN'"
            + " AND (:fromCountry IS NULL OR LOWER(t.fromCountry) LIKE LOWER(CONCAT('%', :fromCountry, '%')))"
            + " AND (:toCountry IS NULL OR LOWER(t.toCountry) LIKE LOWER(CONCAT('%', :toCountry, '%')))"
            + " AND (:date IS NULL OR t.departureDate >= :date)"
            + " ORDER BY t.departureDate ASC")
    List<Trip> search(@Param("fromCountry") String fromCountry,
                      @Param("toCountry") String toCountry,
                      @Param("date") LocalDate date);
}
