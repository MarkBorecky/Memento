package com.memento.user

import com.memento.security.*
import com.memento.session.SessionInfoDTO
import io.jsonwebtoken.Claims
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserInfoService(
    private val userInfoRepository: UserInfoRepository,
    val roleRepository: RoleRepository,
    val passwordEncoder: PasswordEncoder
) : UserDetailsService {

    @Transactional(readOnly = true)
    override fun loadUserByUsername(userName: String): UserDetails =
        userInfoRepository.findByUserName(userName)
            .map { userInfo ->
                with(userInfo) {
                    UserInfoDetails(
                        userName,
                        password,
                        roles.map { role -> SimpleGrantedAuthority(role.name.name) }.toMutableList()
                    )
                }
            }
            .orElseThrow { UsernameNotFoundException("User not found with user name $userName") }


    fun getAllUsers(): List<UserDTO> = userInfoRepository.findAll().map { UserDTO(it) }

    fun getUserById(id: Int): UserDTO = userInfoRepository.findById(id)
        .map { UserDTO(it) }
        .orElseThrow { UserNotFoundException("Not found user with id $id") }

    @Transactional
    fun addUser(request: SignUpRequest): UserDTO {
        val roles = roleRepository.findByName(RoleName.ROLE_USER)
        val user = with(request) {
            UserInfo(
                id = 0,
                password = passwordEncoder.encode(password),
                email = email,
                userName = userName,
                roles = roles
            )
        }

        val savedUser = userInfoRepository.save(user)

        return UserDTO(savedUser)
    }

    fun getCurrentSessionInfo(): SessionInfoDTO {
        val securityContext = SecurityContextHolder.getContext()
        val userName = extractPrincipal(securityContext.authentication)
        return userInfoRepository.findByUserName(userName)
            .map { SessionInfoDTO(it.id, it.userName, it.email) }
            .orElseThrow { UsernameNotFoundException("User not found with user name $userName") }
    }

    private fun extractPrincipal(authentication: Authentication?): String {
        if (authentication == null) {
            throw UserNotFoundException("No user is logged")
        }

        return when (val principal = authentication.principal) {
            is String -> principal
            is UserDetails -> principal.username
            is Claims -> principal.subject
            else -> throw UserNotFoundException("No user is logged")
        }
    }


}
