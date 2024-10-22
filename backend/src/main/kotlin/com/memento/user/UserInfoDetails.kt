package com.memento.user

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserInfoDetails(
    private val userName: String,
    private val password: String,
    private val roles: MutableCollection<out GrantedAuthority>
): UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> = roles

    override fun getPassword(): String = password

    override fun getUsername(): String = userName

}
