package com.carrymate.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.carrymate.dto.AuthResponse;
import com.carrymate.dto.LoginRequest;
import com.carrymate.dto.RegisterRequest;
import com.carrymate.exception.UnauthorizedException;
import com.carrymate.model.AppUser;
import com.carrymate.repository.AppUserRepository;
import com.carrymate.security.AuthContext;
import com.carrymate.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Register / login. Passwords are BCrypt-hashed (cost 12); the raw
 * password is never stored or logged.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists — try logging in instead");
        }
        AppUser user = new AppUser();
        user.setName(req.getName().trim());
        user.setEmail(email);
        user.setPhone(req.getPhone() == null ? null : req.getPhone().trim());
        user.setPasswordHash(BCrypt.withDefaults()
                .hashToString(12, req.getPassword().toCharArray()));
        userRepository.save(user);
        return new AuthResponse(jwtService.createToken(user.getId()),
                user.getId(), user.getName(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        BCrypt.Result result = BCrypt.verifyer()
                .verify(req.getPassword().toCharArray(), user.getPasswordHash());
        if (!result.verified) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return new AuthResponse(jwtService.createToken(user.getId()),
                user.getId(), user.getName(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public AppUser me() {
        return userRepository.findById(AuthContext.currentUserId())
                .orElseThrow(() -> new UnauthorizedException("Login required"));
    }
}
