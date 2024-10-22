package com.memento.security

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional


@Repository
interface UserInfoRepository : JpaRepository<UserInfo, Int> {
    fun findByUserName(login: String): Optional<UserInfo>
}