package com.apnasath.controller;

import com.apnasath.dto.SocietyRequest;
import com.apnasath.model.Society;
import com.apnasath.service.SocietyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/society")
public class SocietyController {

    @Autowired
    private SocietyService societyService;

    @PostMapping("/register")
    public ResponseEntity<?> registerSociety(@Valid @RequestBody SocietyRequest request) {
        try {
            System.out.println("🔵 Society registration endpoint hit");
            System.out.println("📝 Request data: " + request.getName());

            Society society = societyService.registerSociety(request);

            System.out.println("✅ Society registered successfully: " + society.getRegistrationCode());
            return ResponseEntity.status(HttpStatus.CREATED).body(society);
        } catch (Exception e) {
            System.err.println("❌ Error registering society: " + e.getMessage());
            e.printStackTrace();

            // Return proper error response
            ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Error Response class
    static class ErrorResponse {
        private String message;
        private long timestamp;

        public ErrorResponse(String message) {
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MEMBER', 'SECRETARY', 'ADMIN')")
    public ResponseEntity<Society> getSociety(@PathVariable Long id) {
        Society society = societyService.getSocietyById(id);
        return ResponseEntity.ok(society);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Society>> getAllSocieties() {
        List<Society> societies = societyService.getAllSocieties();
        return ResponseEntity.ok(societies);
    }
}
