package com.memento.course

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "course")
class Course(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Int,
    var name: String,
    @Column(name = "language_a") var languageA: String,
    @Column(name = "language_b") var languageB: String
)
