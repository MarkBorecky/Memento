package com.memento.security

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class SignUpRequest(
    @NotBlank
    @Size(min = 3, max = 15)
    val userName: String,
    @NotBlank
    @Size(max = 40)
    @Email
    val email: String,
    @NotBlank
    @Size(min = 6, max = 20)
    val password: String
)