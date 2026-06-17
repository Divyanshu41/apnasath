package com.apnasath.controller;

import com.apnasath.model.User;
import com.apnasath.service.MemberVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verification")
public class MemberVerificationController {

    @Autowired
    private MemberVerificationService verificationService;

    @GetMapping("/pending/{societyId}")
    @PreAuthorize("hasAnyRole('SECRETARY', 'ADMIN')")
    public ResponseEntity<List<User>> getPendingVerifications(@PathVariable Long societyId) {
        List<User> pendingUsers = verificationService.getPendingVerifications(societyId);
        return ResponseEntity.ok(pendingUsers);
    }

    @PutMapping("/verify/{userId}")
    @PreAuthorize("hasAnyRole('SECRETARY', 'ADMIN')")
    public ResponseEntity<User> verifyMember(@PathVariable Long userId) {
        User verifiedUser = verificationService.verifyMember(userId);
        return ResponseEntity.ok(verifiedUser);
    }

    @PutMapping("/reject/{userId}")
    @PreAuthorize("hasAnyRole('SECRETARY', 'ADMIN')")
    public ResponseEntity<User> rejectMember(@PathVariable Long userId) {
        User rejectedUser = verificationService.rejectMember(userId);
        return ResponseEntity.ok(rejectedUser);
    }

    @GetMapping("/members/{societyId}")
    @PreAuthorize("hasAnyRole('MEMBER', 'SECRETARY', 'ADMIN')")
    public ResponseEntity<List<User>> getSocietyMembers(@PathVariable Long societyId) {
        List<User> members = verificationService.getSocietyMembers(societyId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/verified/{societyId}")
    @PreAuthorize("hasAnyRole('MEMBER', 'SECRETARY', 'ADMIN')")
    public ResponseEntity<List<User>> getVerifiedMembers(@PathVariable Long societyId) {
        List<User> verifiedMembers = verificationService.getVerifiedMembers(societyId);
        return ResponseEntity.ok(verifiedMembers);
    }
}
