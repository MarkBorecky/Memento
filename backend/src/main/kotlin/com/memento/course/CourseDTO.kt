package com.memento.course

data class CourseDTO(
    val id: Int,
    val name: String,
    val languageA: String,
    val languageB: String,
    val cardsAmount: Int,
) {
    constructor(course: Course) : this(course.id, course.name, course.languageA, course.languageB, course.flashCards.size)
}