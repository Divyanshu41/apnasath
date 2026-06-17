package com.apnasath.repository;

import com.apnasath.model.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocietyRepository extends JpaRepository<Society, Long> {

    Optional<Society> findByName(String name);

    Optional<Society> findByRegistrationCode(String registrationCode);

    Boolean existsByName(String name);

    Boolean existsByRegistrationCode(String registrationCode);
}
