package com.memento.course

import com.memento.flashcards.FlashCardDTO

class CourseDetailsDTO(val details: CourseDTO, val flashCards: List<FlashCardDTO>) {
    constructor(course: Course) : this(CourseDTO(course), course.flashCards.map { FlashCardDTO(it) })

}
