package com.memento.course

data class CourseDTO(
    val id: Int,
    val name: String,
    val authorName: String,
    val languageA: String,
    val languageB: String,
    val cardsAmount: Int,
) {
    constructor(course: Course) : this(course.id, course.name, course.author.userName, course.languageA, course.languageB, course.flashCards.size)
}