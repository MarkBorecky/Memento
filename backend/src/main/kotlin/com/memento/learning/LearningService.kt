package com.memento.learning

import com.memento.course.CourseDTO
import com.memento.course.CourseRepository
import com.memento.flashcards.FlashCard
import com.memento.flashcards.FlashCardRepository
import com.memento.security.UserInfoRepository
import com.memento.user.UserDTO
import com.memento.user.UserNotFoundException
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class LearningService(
    private val courseRepository: CourseRepository,
    private val userRepository: UserInfoRepository,
    private val learningFlashCardRepository: LearningFlashCardRepository,
    private val flashCardRepository: FlashCardRepository
) {
    fun addCourseToUsersLearningCourses(userId: Int, courseId: Int): UserDTO {
        val userReference =
            userRepository.findById(userId).orElseThrow { UserNotFoundException("User not found with id $userId") }

        userReference.addLearningCourse(courseRepository.getReferenceById(courseId))

        val savedUser = userRepository.save(userReference)

        return UserDTO(savedUser)
    }

    fun getUserLearningCourses(userId: Int): List<CourseDTO> {
        val user = userRepository.findById(userId)
            .orElseThrow { throw UserNotFoundException("User not found with id $userId") }
        return user.getLearningCourses().map { CourseDTO(it.id, it.name, it.languageA, it.languageB) }
    }

    fun getLearningFlashCardSet(userId: Int, courseId: Int, size: Int): List<LearningFlashCardDTO> {
        val learntAnswerCountBorder = 7

        val projection = learningFlashCardRepository
            .findFlashCardsToLearnByUserAndCourse(userId, courseId, learntAnswerCountBorder, size)

        return projection.map {

            with(it) {
                LearningFlashCardDTO(
                    createLearningFlashCardId(flashCardId, courseId, userId),
                    valueA,
                    valueB,
                    correctAnswerCount)
            }
        }
    }

    private fun createLearningFlashCardId(flashCardId: Int, courseId: Int, userId: Int): String =
        "$userId-$courseId-$flashCardId"

    fun saveLearningProgress(userId: Int, courseId: Int, progress: ProgressRequestDTO) {
        val learningFlashCardsIds = progress.flashCardsProgress.map { it.mapToLearningCourseFlashCardId() }
        val storedLearningFlashCardsMap = learningFlashCardRepository.findAllById(learningFlashCardsIds).map { it.id.toString() to it.correctAnswerCount }.toMap()

        val cardsToManyPersist = progress.flashCardsProgress.map {
            val id = it.mapToLearningCourseFlashCardId()

            val flashCardId: FlashCard = flashCardRepository.getReferenceById(id.flashCardId)

            LearningFlashCard(
                id = id,
                flashCard = flashCardId,
                correctAnswerCount = storedLearningFlashCardsMap.getOrDefault(id.toString(), 0) + it.correctAnswersCount,
                lastCorrectAnswer = Instant.now(),
                nextAskingTime = Instant.now()
            )
        }

        val savedItems = learningFlashCardRepository.saveAll(cardsToManyPersist)
        println(savedItems)
    }

}
