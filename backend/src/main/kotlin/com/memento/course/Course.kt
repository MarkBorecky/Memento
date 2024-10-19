package com.memento.course

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
class Course(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)val id: Int,
    val name: String,
    val languageA: String,
    val languageB: String
) {}
