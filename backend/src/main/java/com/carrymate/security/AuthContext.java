package com.carrymate.security;

import com.carrymate.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Reads the user id the {@link JwtAuthFilter} placed on the current
 * request. Services call {@link #currentUserId()} so every action is
 * scoped to the logged-in user.
 */
public final class AuthContext {

    public static final String USER_ID_ATTR = "currentUserId";

    private AuthContext() {
    }

    public static Long currentUserId() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = attrs.getRequest();
        Long userId = (Long) request.getAttribute(USER_ID_ATTR);
        if (userId == null) {
            throw new UnauthorizedException("Login required");
        }
        return userId;
    }
}
