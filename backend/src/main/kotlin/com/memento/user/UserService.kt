package com.memento.user

import org.springframework.stereotype.Service

@Service
class UserService(val userRepository: UserRepository)
