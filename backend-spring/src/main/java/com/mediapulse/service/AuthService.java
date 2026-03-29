package com.mediapulse.service;

import com.mediapulse.dto.LoginRequest;
import com.mediapulse.dto.RegisterRequest;
import com.mediapulse.entity.User;
import com.mediapulse.repository.UserRepository;
import com.mediapulse.security.JwtTokenProvider;
import com.mediapulse.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    private static final List<String> ALLOWED_ROLES =
            Arrays.asList("marketing_team", "content_creator", "executive", "it_support");

    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
        }

        String role = ALLOWED_ROLES.contains(request.getRole()) ? request.getRole() : "marketing_team";

        User user = new User();
        user.setFullName(request.getFull_name());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtTokenProvider.generateToken(userDetails);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Account created successfully.");
        result.put("token", token);
        result.put("user", toUserMap(user));
        return result;
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is deactivated. Contact admin.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtTokenProvider.generateToken(userDetails);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Login successful.");
        result.put("token", token);
        result.put("user", toUserMap(user));
        return result;
    }

    public Map<String, Object> getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("full_name", user.getFullName());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());
        userMap.put("created_at", user.getCreatedAt());

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("user", userMap);
        return result;
    }

    private Map<String, Object> toUserMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("full_name", user.getFullName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        return map;
    }
}
