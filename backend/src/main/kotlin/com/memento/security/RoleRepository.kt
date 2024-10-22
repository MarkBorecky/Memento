package com.memento.security

import com.memento.user.Role
import com.memento.user.RoleName
import org.springframework.data.jpa.repository.JpaRepository

interface RoleRepository: JpaRepository<Role, Int> {
    fun findByName(roleUser: RoleName): Set<Role>

}
