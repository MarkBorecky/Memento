package com.memento.flashcards

import com.memento.course.Course
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface FlashCardRepository: JpaRepository<FlashCard, Int> {
    fun findAllByCourseOrderById(course: Course): List<FlashCard>
    fun deleteByCourseIdAndId(courseId: Int, flashCardId: Int): Void
    fun findByCourseAndId(course: Course, flashCardId: Int): Optional<FlashCard>

}
