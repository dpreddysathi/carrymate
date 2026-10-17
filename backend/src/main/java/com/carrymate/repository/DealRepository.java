package com.carrymate.repository;

import com.carrymate.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DealRepository extends JpaRepository<Deal, Long> {

    @Query("SELECT d FROM Deal d WHERE d.traveler.id = :userId OR d.shopper.id = :userId"
            + " ORDER BY d.updatedAt DESC")
    List<Deal> findMyDeals(@Param("userId") Long userId);
}
