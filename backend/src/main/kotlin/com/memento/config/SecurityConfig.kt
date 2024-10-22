package com.memento.config

import com.memento.security.JwtAuthenticationFilter
import com.memento.security.JwtService
import com.memento.security.RoleRepository
import com.memento.security.UserInfoRepository
import com.memento.user.UserInfoService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter


@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtService: JwtService,
    private val userInfoRepository: UserInfoRepository,
    private val roleRepository: RoleRepository,
) {

    @Bean
    fun userInfoService(): UserInfoService {
        return UserInfoService(userInfoRepository, roleRepository, passwordEncoder()) // Ensure UserInfoService implements UserDetailsService
    }

    @Bean
    @Throws(java.lang.Exception::class)
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager? {
        return config.authenticationManager
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun jwtAuthenticationFilter(): JwtAuthenticationFilter {
        return JwtAuthenticationFilter(jwtService, userInfoService())
    }

    @Bean
    @Throws(Exception::class)
    fun securityWebFilterChain(http: HttpSecurity): SecurityFilterChain = http
        .cors { cors -> cors.disable() }
        .csrf { csrf -> csrf.disable() }
        .authorizeHttpRequests { requests -> requests
            .requestMatchers(HttpMethod.GET, "/courses/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()
            .anyRequest().authenticated()
        }
        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter::class.java)
        .build()
}