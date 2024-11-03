package com.memento.session

import com.memento.user.UserInfoService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SessionController(val userService: UserInfoService) {
    /**
     * return user information from current session
     */
    @GetMapping("/session")
    fun getSession(): SessionInfoDTO = userService.getCurrentSessionInfo()
}