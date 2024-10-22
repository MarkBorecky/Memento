package com.memento.security

import jakarta.validation.constraints.NotBlank

class LoginRequest(
    @NotBlank val login: String,
    @NotBlank val password: String
)