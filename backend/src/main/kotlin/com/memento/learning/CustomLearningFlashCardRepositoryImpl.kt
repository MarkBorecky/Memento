package com.memento.learning

import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext

class CustomLearningFlashCardRepositoryImpl(
    @PersistenceContext
    private val entityManager: EntityManager
) : CustomLearningFlashCardRepository {

    override fun findFlashCardsToLearnByUserAndCourse(
        userId: Int,
        courseId: Int,
        learntAnswerCountBorder: Int
    ): List<FlashCardProjection> {
        return entityManager.createQuery(
            """
                Select 
                  new com.memento.learning.FlashCardProjection(
                    fc.course.id,
                    coalesce(lfc.id.userId, :userId), 
                    fc.id,
                    coalesce(lfc.correctAnswerCount, 0),
                    fc.valueA,
                    fc.valueB
                  )
                from FlashCard fc
                left join LearningFlashCard lfc on lfc.flashCard = fc 
                where (
                    coalesce(lfc.id.userId, :userId) = :userId 
                    and coalesce(fc.course.id, :courseId) = :courseId
                    and coalesce(lfc.correctAnswerCount, 0) < :learntAnswerCountBorder
                )
            """.trimIndent(),
            FlashCardProjection::class.java
        )
            .setParameter("learntAnswerCountBorder", learntAnswerCountBorder)
            .setParameter("userId", userId)
            .setParameter("courseId", courseId)
            .resultList
    }

}