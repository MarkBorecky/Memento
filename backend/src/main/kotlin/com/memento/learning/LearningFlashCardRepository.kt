package com.memento.learning

import com.memento.flashcards.FlashCard
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface LearningFlashCardRepository: JpaRepository<LearningFlashCard, LearningCourseFlashCardId> {
    @Query("""
        select lfc from LearningFlashCard lfc
        where lfc.id.userId = :userId and
            lfc.id.courseId = :courseId and
            lfc.correctAnswerCount < :learntAnswerCountBorder

    """)
    fun findByUserIdAndCourseId(userId: Int, courseId: Int, pageable: Pageable, learntAnswerCountBorder: Int): List<LearningFlashCard>

    @Query("""
        select fc from FlashCard fc
        where fc.course.id = :courseId and
            fc.id not in (:ids)
    """)
    fun findByCourseIdAndIgnoreFetchedIds(courseId: Int, ids: List<Int>, pageable: Pageable): List<FlashCard>

}
