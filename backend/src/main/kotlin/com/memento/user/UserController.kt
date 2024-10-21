package com.memento.user

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(userService: UserService) {

    @GetMapping("/users")
    fun getUsers(): List<UserDTO> = listOf(UserDTO(0, "andrzej"), UserDTO(1, "duda"))
}