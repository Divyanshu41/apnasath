package com.apnasath.service;

import com.apnasath.dto.AuthResponse;
import com.apnasath.dto.LoginRequest;
import com.apnasath.dto.SignupRequest;
import com.apnasath.model.Society;
import com.apnasath.model.User;
import com.apnasath.repository.SocietyRepository;
import com.apnasath.repository.UserRepository;
import com.apnasath.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SocietyRepository societyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        System.out.println("🔵 Signup request received for email: " + request.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            System.out.println("❌ Email already exists: " + request.getEmail());
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            System.out.println("❌ Phone already exists: " + request.getPhone());
            throw new RuntimeException("Phone number already registered");
        }

        System.out.println("🔍 Looking for society with code: " + request.getSocietyCode());

        // Find society by registration code
        Society society = societyRepository.findByRegistrationCode(request.getSocietyCode())
                .orElseThrow(() -> new RuntimeException(
                        "Invalid society registration code. Please check the society code."));

        System.out.println("✅ Society found: " + society.getName());

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFlatNumber(request.getFlatNumber());
        user.setSociety(society);
        user.setRole(User.UserRole.MEMBER);
        user.setVerificationStatus(User.VerificationStatus.PENDING);
        user.setIsActive(true);

        System.out.println("💾 Saving user to database...");
        User savedUser = userRepository.save(user);
        System.out.println("✅ User saved successfully with ID: " + savedUser.getId());

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        System.out.println("🎫 JWT token generated for user: " + savedUser.getEmail());

        return new AuthResponse(
                token,
                "Bearer",
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getFlatNumber(),
                savedUser.getRole().name(),
                savedUser.getVerificationStatus().name(),
                savedUser.getSociety().getId());
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmailOrPhone(),
                        request.getPassword()));

        // Find user
        User user = userRepository.findByEmail(request.getEmailOrPhone())
                .or(() -> userRepository.findByPhone(request.getEmailOrPhone()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is active
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getFlatNumber(),
                user.getRole().name(),
                user.getVerificationStatus().name(),
                user.getSociety().getId());
    }

    public long getTotalUsersCount() {
        return userRepository.count();
    }
}
