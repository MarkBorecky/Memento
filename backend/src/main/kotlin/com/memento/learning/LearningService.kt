package com.memento.learning

import com.memento.course.CourseDTO
import com.memento.course.CourseRepository
import com.memento.security.UserInfoRepository
import com.memento.user.UserDTO
import com.memento.user.UserNotFoundException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class LearningService(
    private val courseRepository: CourseRepository,
    private val userRepository: UserInfoRepository,
    private val learningFlashCardRepository: LearningFlashCardRepository
) {
    fun addCourseToUsersLearningCourses(userId: Int, courseId: Int): UserDTO {
        val userReference = userRepository.findById(userId).orElseThrow { UserNotFoundException("User not found with id $userId") }

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
        //1 fetch items from learning_flash_cards
        val flashCards = learningFlashCardRepository.findByUserIdAndCourseId(userId, courseId, Pageable.ofSize(5))

        val oldDeck = flashCards
            .map { LearningFlashCardDTO(it.flashCard.valueA, it.flashCard.valueB) }

        //2 fetch rest of items from flash_cards by id
        val deckSize = oldDeck.size
        if (deckSize >= size) {
            return oldDeck
        }

        val fetchFlashCardIds = flashCards.map { it.id.flashCardId }
        val pageable = Pageable.ofSize(size - deckSize)
        val newDeck = learningFlashCardRepository.findByCourseIdAndIgnoreFetchedIds(courseId, fetchFlashCardIds, pageable)
            .map { LearningFlashCardDTO(it.valueA, it.valueB) }
        return oldDeck + newDeck
    }
}
