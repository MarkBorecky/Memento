package com.memento.security

import com.memento.user.UserDTO
import com.memento.user.UserInfoService
import jakarta.validation.Valid
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val userService: UserInfoService,
    private val jwtService: JwtService
) {

    @PostMapping("/auth/signup")
    fun authenticate(@Valid @RequestBody signUpRequest: SignUpRequest): UserDTO = userService.addUser(signUpRequest)

    @PostMapping("/auth/signin")
    fun authenticateUser(@Valid @RequestBody loginRequest: LoginRequest): JwtAuthenticationResponse {
        val authenticationToken = with(loginRequest) { UsernamePasswordAuthenticationToken(login, password) }
        val authentication = authenticationManager.authenticate(authenticationToken)

        SecurityContextHolder.getContext().authentication = authentication
        val userDetails: UserDetails = authentication.principal as UserDetails
        val token = jwtService.generateToken(userDetails)
        return JwtAuthenticationResponse(token)
    }
}