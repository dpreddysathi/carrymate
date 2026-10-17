package com.carrymate.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Returned by register and login: the token plus who it belongs to. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private Long id;
    private String name;
    private String email;
}
