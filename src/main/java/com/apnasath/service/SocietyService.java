package com.apnasath.service;

import com.apnasath.dto.SocietyRequest;
import com.apnasath.model.Society;
import com.apnasath.repository.SocietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class SocietyService {

    @Autowired
    private SocietyRepository societyRepository;

    @Transactional
    public Society registerSociety(SocietyRequest request) {
        System.out.println("🏢 Society registration request received: " + request.getName());

        // Check if society already exists
        if (societyRepository.existsByName(request.getName())) {
            System.out.println("❌ Society already exists: " + request.getName());
            throw new RuntimeException("Society with this name already exists");
        }

        Society society = new Society();
        society.setName(request.getName());
        society.setAddress(request.getAddress());
        society.setPincode(request.getPincode());
        society.setCity(request.getCity());
        society.setState(request.getState());
        society.setTotalFlats(request.getTotalFlats());
        society.setTotalBlocks(request.getTotalBlocks());
        String regCode = generateRegistrationCode();
        society.setRegistrationCode(regCode);
        society.setIsActive(true);

        System.out.println("💾 Saving society to database...");
        Society savedSociety = societyRepository.save(society);
        System.out.println("✅ Society saved successfully with ID: " + savedSociety.getId());
        System.out.println("🔑 Registration Code: " + regCode);

        return savedSociety;
    }

    public Society getSocietyById(Long id) {
        return societyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Society not found with id: " + id));
    }

    public List<Society> getAllSocieties() {
        return societyRepository.findAll();
    }

    private String generateRegistrationCode() {
        String code;
        do {
            code = "SOC" + String.format("%06d", new Random().nextInt(999999));
        } while (societyRepository.existsByRegistrationCode(code));
        return code;
    }
}
