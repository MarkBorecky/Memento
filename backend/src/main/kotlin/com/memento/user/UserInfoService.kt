package com.memento.user

import com.memento.security.RoleRepository
import com.memento.security.SignUpRequest
import com.memento.security.UserInfo
import com.memento.security.UserInfoRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
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
): UserDetailsService {

    @Transactional(readOnly = true)
    override fun loadUserByUsername(userName: String): UserDetails =
        userInfoRepository.findByUserName(userName)
            .map{ userInfo -> with (userInfo) {
                UserInfoDetails(
                    userName,
                    password,
                    roles.map { role -> SimpleGrantedAuthority(role.name.name) }.toMutableList()
                )
            }}
            .orElseThrow { UsernameNotFoundException("User not found with user name $userName") }


    fun getAllUsers(): List<UserDTO> = userInfoRepository.findAll().map(::mapToDto)

    fun getUserById(id: Int): UserDTO = userInfoRepository.findById(id)
        .map(::mapToDto)
        .orElseThrow { UserNotFoundException("Not found user with id $id") }

    private fun mapToDto(user: UserInfo): UserDTO = with(user) {
        UserDTO(
            id = id,
            userName = userName,
            email = email
        )
    }

    fun addUser(request: SignUpRequest): UserDTO {
        val roles = roleRepository.findByName(RoleName.ROLE_USER)
        val user = with (request) {
            UserInfo(
                id = 0,
                password = passwordEncoder.encode(password),
                email = email,
                userName = userName,
                roles = roles
            )
        }

        val savedUser = userInfoRepository.save(user)

        return mapToDto(savedUser)
    }

}
