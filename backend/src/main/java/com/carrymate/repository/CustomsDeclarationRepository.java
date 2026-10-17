package com.carrymate.repository;

import com.carrymate.model.CustomsDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomsDeclarationRepository extends JpaRepository<CustomsDeclaration, Long> {

    Optional<CustomsDeclaration> findByDealId(Long dealId);
}
