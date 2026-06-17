package com.apnasath.controller;

import com.apnasath.dto.HelpRequestDTO;
import com.apnasath.model.HelpRequest;
import com.apnasath.model.HelpRequest.HelpStatus;
import com.apnasath.service.HelpRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/help-requests")
@PreAuthorize("hasAnyRole('MEMBER', 'SECRETARY', 'ADMIN')")
public class HelpRequestController {

    @Autowired
    private HelpRequestService helpRequestService;

    @PostMapping
    public ResponseEntity<?> createHelpRequest(
            @Valid @RequestBody HelpRequestDTO dto,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            HelpRequest helpRequest = helpRequestService.createHelpRequest(dto, userEmail);

            Map<String, Object> response = new HashMap<>();
            response.put("id", helpRequest.getId());
            response.put("title", helpRequest.getTitle());
            response.put("description", helpRequest.getDescription());
            response.put("category", helpRequest.getCategory());
            response.put("priority", helpRequest.getPriority());
            response.put("status", helpRequest.getStatus());
            response.put("createdAt", helpRequest.getCreatedAt());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<?> getAllHelpRequestsBySociety(@PathVariable Long societyId) {
        try {
            List<HelpRequest> requests = helpRequestService.getAllHelpRequestsBySociety(societyId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyHelpRequests(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<HelpRequest> requests = helpRequestService.getMyHelpRequests(userEmail);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}/status/{status}")
    public ResponseEntity<?> getHelpRequestsByStatus(
            @PathVariable Long societyId,
            @PathVariable HelpStatus status) {
        try {
            List<HelpRequest> requests = helpRequestService.getHelpRequestsByStatus(societyId, status);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptHelpRequest(
            @PathVariable Long requestId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            HelpRequest helpRequest = helpRequestService.acceptHelpRequest(requestId, userEmail);
            return ResponseEntity.ok(helpRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{requestId}/resolve")
    public ResponseEntity<?> resolveHelpRequest(
            @PathVariable Long requestId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            HelpRequest helpRequest = helpRequestService.resolveHelpRequest(requestId, userEmail);
            return ResponseEntity.ok(helpRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}/count/open")
    public ResponseEntity<?> getOpenHelpRequestsCount(@PathVariable Long societyId) {
        try {
            Long count = helpRequestService.getOpenHelpRequestsCount(societyId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
