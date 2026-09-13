package org.example.developersb_submission.controller;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    @GetMapping("/api/auth/status")
    public Map<String, Object> status(Authentication authentication) {
        var authenticated = authentication != null
                && !(authentication instanceof AnonymousAuthenticationToken)
                && authentication.isAuthenticated();

        return Map.of(
                "authenticated", authenticated,
                "username", authenticated ? authentication.getName() : "",
                "isAdmin", authenticated && hasRoleAdmin(authentication)
        );
    }

    private boolean hasRoleAdmin(Authentication authentication) {
        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }
}
