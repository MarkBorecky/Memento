package com.memento.user

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(val userService: UserInfoService) {

    @GetMapping("/users")
    fun getUsers(): List<UserDTO> = userService.getAllUsers();

    @GetMapping("/users/{id}")
    fun getUserById(@PathVariable id: Int): UserDTO = userService.getUserById(id)



}