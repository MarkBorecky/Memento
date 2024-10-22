package com.memento.security

class JwtAuthenticationResponse(
    val accessToken: String,
    val tokenType: String = "Bearer"
)