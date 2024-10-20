package com.memento.course

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
class Course(
    @Id @GeneratedValue (strategy = GenerationType.IDENTITY) val id: Int,
    var name: String,
    var languageA: String,
    var languageB: String
)
