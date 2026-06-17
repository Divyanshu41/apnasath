package com.apnasath.controller;

import com.apnasath.dto.SharedItemDTO;
import com.apnasath.model.SharedItem;
import com.apnasath.service.SharedItemService;
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
@RequestMapping("/api/shared-items")
@PreAuthorize("hasAnyRole('MEMBER', 'SECRETARY', 'ADMIN')")
public class SharedItemController {

    @Autowired
    private SharedItemService sharedItemService;

    @PostMapping
    public ResponseEntity<?> createSharedItem(
            @Valid @RequestBody SharedItemDTO dto,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            SharedItem item = sharedItemService.createSharedItem(dto, userEmail);

            Map<String, Object> response = new HashMap<>();
            response.put("id", item.getId());
            response.put("itemName", item.getItemName());
            response.put("description", item.getDescription());
            response.put("category", item.getCategory());
            response.put("status", item.getStatus());
            response.put("availableFrom", item.getAvailableFrom());
            response.put("availableUntil", item.getAvailableUntil());
            response.put("createdAt", item.getCreatedAt());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<?> getAllItemsBySociety(@PathVariable Long societyId) {
        try {
            List<SharedItem> items = sharedItemService.getAllItemsBySociety(societyId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-items")
    public ResponseEntity<?> getMySharedItems(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<SharedItem> items = sharedItemService.getMySharedItems(userEmail);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}/available")
    public ResponseEntity<?> getAvailableItems(@PathVariable Long societyId) {
        try {
            List<SharedItem> items = sharedItemService.getAvailableItems(societyId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{itemId}/borrow")
    public ResponseEntity<?> borrowItem(
            @PathVariable Long itemId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            SharedItem item = sharedItemService.borrowItem(itemId, userEmail);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{itemId}/return")
    public ResponseEntity<?> returnItem(
            @PathVariable Long itemId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            SharedItem item = sharedItemService.returnItem(itemId, userEmail);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}/count/available")
    public ResponseEntity<?> getAvailableItemsCount(@PathVariable Long societyId) {
        try {
            Long count = sharedItemService.getAvailableItemsCount(societyId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
