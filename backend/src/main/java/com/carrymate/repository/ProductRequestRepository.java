package com.carrymate.repository;

import com.carrymate.model.ProductRequest;
import com.carrymate.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRequestRepository extends JpaRepository<ProductRequest, Long> {

    List<ProductRequest> findByShopperIdOrderByCreatedAtDesc(Long shopperId);

    List<ProductRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    @Query("SELECT r FROM ProductRequest r WHERE r.status = 'OPEN'"
            + " AND (:buyCountry IS NULL OR LOWER(r.buyCountry) LIKE LOWER(CONCAT('%', :buyCountry, '%')))"
            + " AND (:category IS NULL OR LOWER(r.category) = LOWER(:category))"
            + " AND (:q IS NULL OR LOWER(r.productName) LIKE LOWER(CONCAT('%', :q, '%')))"
            + " ORDER BY r.createdAt DESC")
    List<ProductRequest> search(@Param("buyCountry") String buyCountry,
                                @Param("category") String category,
                                @Param("q") String q);
}
