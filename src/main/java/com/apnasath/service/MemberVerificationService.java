package com.apnasath.service;

import com.apnasath.model.User;
import com.apnasath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MemberVerificationService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getPendingVerifications(Long societyId) {
        return userRepository.findBySocietyIdAndVerificationStatus(
                societyId,
                User.VerificationStatus.PENDING);
    }

    @Transactional
    public User verifyMember(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getVerificationStatus() != User.VerificationStatus.PENDING) {
            throw new RuntimeException("User is not in pending verification status");
        }

        user.setVerificationStatus(User.VerificationStatus.VERIFIED);
        return userRepository.save(user);
    }

    @Transactional
    public User rejectMember(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getVerificationStatus() != User.VerificationStatus.PENDING) {
            throw new RuntimeException("User is not in pending verification status");
        }

        user.setVerificationStatus(User.VerificationStatus.REJECTED);
        user.setIsActive(false);
        return userRepository.save(user);
    }

    public List<User> getSocietyMembers(Long societyId) {
        return userRepository.findBySocietyId(societyId);
    }

    public List<User> getVerifiedMembers(Long societyId) {
        return userRepository.findBySocietyIdAndVerificationStatus(
                societyId,
                User.VerificationStatus.VERIFIED);
    }
}
