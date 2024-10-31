package com.memento.course

data class CourseDTO(
    val id: Int,
    val name: String,
    val languageA: String,
    val languageB: String
) {
    constructor(course: Course) : this(course.id, course.name, course.languageA, course.languageB)
}