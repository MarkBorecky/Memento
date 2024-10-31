package com.memento.security

import org.springframework.data.jpa.repository.JpaRepository

interface RoleRepository: JpaRepository<Role, Int> {
    fun findByName(roleUser: RoleName): Set<Role>

}
