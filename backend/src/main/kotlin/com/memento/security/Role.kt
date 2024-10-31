package com.memento.security

import jakarta.persistence.*
import org.hibernate.annotations.NaturalId

@Entity
@Table(name = "roles")
class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: String,
    @Enumerated(EnumType.STRING)
    @NaturalId
    val name: RoleName,
    @ManyToMany(targetEntity = UserInfo::class, mappedBy = "roles", fetch = FetchType.LAZY)
    open var users: Set<UserInfo>? = setOf()
)

enum class RoleName {
    ROLE_USER,
    ROLE_ADMIN
}