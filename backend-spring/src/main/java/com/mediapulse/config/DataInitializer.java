package com.mediapulse.config;

import com.mediapulse.entity.User;
import com.mediapulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_PASSWORD = "Password@123";

    private static final List<Object[]> DEFAULT_USERS = List.of(
        new Object[]{"Admin User",    "admin@mediapulse.com",  "admin"},
        new Object[]{"Sarah Johnson", "sarah@mediapulse.com",  "marketing_team"},
        new Object[]{"David Lee",     "david@mediapulse.com",  "content_creator"},
        new Object[]{"Emily Chen",    "emily@mediapulse.com",  "executive"},
        new Object[]{"Mark Thompson", "mark@mediapulse.com",   "it_support"}
    );

    @Override
    public void run(String... args) {
        for (Object[] data : DEFAULT_USERS) {
            String fullName = (String) data[0];
            String email    = (String) data[1];
            String role     = (String) data[2];

            Optional<User> existing = userRepository.findByEmail(email);

            if (existing.isPresent()) {
                User user = existing.get();
                // Re-encode only if the stored hash doesn't match (fixes $2b$ vs $2a$ prefix issue)
                if (!passwordEncoder.matches(DEFAULT_PASSWORD, user.getPasswordHash())) {
                    user.setPasswordHash(passwordEncoder.encode(DEFAULT_PASSWORD));
                    user.setUpdatedAt(LocalDateTime.now());
                    userRepository.save(user);
                    log.info("[DataInitializer] Fixed password hash for: {}", email);
                }
            } else {
                // User doesn't exist — create with properly encoded password
                User user = new User();
                user.setFullName(fullName);
                user.setEmail(email);
                user.setPasswordHash(passwordEncoder.encode(DEFAULT_PASSWORD));
                user.setRole(role);
                user.setIsActive(true);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
                log.info("[DataInitializer] Created default user: {}", email);
            }
        }
    }
}
