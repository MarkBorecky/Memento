package com.memento.user

import com.memento.security.UserInfo

data class UserDTO(
    val id: Int,
    val userName: String,
    val email: String
) {

    constructor(user: UserInfo) : this(user.id, user.userName, user.email)

}
