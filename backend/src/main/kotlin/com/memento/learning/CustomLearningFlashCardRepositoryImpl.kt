package com.memento.learning

import com.memento.course.CourseDTO
import com.memento.course.CourseDetailsDTO
import com.memento.course.CourseRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext

class CustomLearningFlashCardRepositoryImpl(
    @PersistenceContext
    private val entityManager: EntityManager,
    private val courseRepository: CourseRepository
) : CustomLearningFlashCardRepository {

    override fun findFlashCardsToLearnByUserAndCourse(
        userId: Int,
        courseId: Int,
        threshold: Int,
        size: Int
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
                    and coalesce(lfc.correctAnswerCount, 0) < :threshold
                )
            """.trimIndent(),
            FlashCardProjection::class.java
        )
            .setParameter("threshold", threshold)
            .setParameter("userId", userId)
            .setParameter("courseId", courseId)
            .setMaxResults(size)
            .resultList
    }

    override fun getAllLearningCoursesWithDetailsByUserid(userId: Int): List<CourseDetailsDTO> {

        // learning courses
        // ile u?ytkownik ma kórsów w swojej kolekcji ?? i ile ma fiszek nauczonych i w trakcie nauki dla ka?dego kursu

        // courses
        // ile fiszek ma kazdy kurs

        val learningCoursesResults = entityManager.createNativeQuery(
            """
            SELECT
                    user_learning_courses.course_id,
                    sum(case when coalesce(learning_flash_cards.correct_answer_count, 0) > :threshold then 1 else 0 end),
                    sum(case when coalesce(learning_flash_cards.correct_answer_count, 0) <= :threshold and coalesce(learning_flash_cards.correct_answer_count, 0) > 0 then 1 else 0 end)
            FROM user_learning_courses
                LEFT JOIN courses
                    ON courses.id = user_learning_courses.course_id
                LEFT JOIN learning_flash_cards
                    ON user_learning_courses.course_id = learning_flash_cards.course_id
            
            WHERE user_learning_courses.user_id = :userId
            group by user_learning_courses.course_id   
        """.trimIndent()
        )
            .setParameter("userId", userId)
            .setParameter("threshold", 2)
            .resultList

        val learningCourses = learningCoursesResults.map {
            val data = it as Array<*>
            LearningDetails(
                courseId = data[0] as Int,
                learntItems = (data[1] as Number).toInt(),
                learningItems = (data[2] as Number).toInt()
            )
        }

        val learningCoursesIds = learningCourses.map(LearningDetails::courseId)

        val coursesDetailsMap = courseRepository.findAllById(learningCoursesIds)
            .associateBy { it.id }

        return learningCourses.map {
            val course = coursesDetailsMap[it.courseId] ?: throw Exception("Can't find course with id ${it.courseId}")
            CourseDetailsDTO(it, CourseDTO(course))
        }
    }
}