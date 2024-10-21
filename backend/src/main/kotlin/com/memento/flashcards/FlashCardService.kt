package com.memento.flashcards

import com.memento.course.Course
import com.memento.course.CourseNotFoundException
import com.memento.course.CourseRepository
import com.memento.course.CourseService
import org.springframework.stereotype.Service

@Service
class FlashCardService(
    val flashCardRepository: FlashCardRepository,
    val courseRepository: CourseRepository,
    private val courseService: CourseService,
) {
    fun getAllFlashCardsByCourse(courseId: Int): List<FlashCardDTO> {
        val flashCards = courseRepository.findById(courseId)
            .map(flashCardRepository::findAllByCourse)
            .orElseThrow { CourseNotFoundException("Not found course with id $courseId") }

        return flashCards.map { flashCard -> mapToDTO(flashCard) }
    }

    fun addFlashCard(flashCardDto: FlashCardDTO, courseId: Int): FlashCardDTO {
        val course = courseRepository.getReferenceById(courseId)
        val flashCard = mapToEntity(flashCardDto, course)
        val savedFlashCard = flashCardRepository.save(flashCard)
        return mapToDTO(savedFlashCard)
    }

    fun getByCourseAndById(courseId: Int, flashCardId: Int): FlashCardDTO {
        val course = courseRepository.findById(courseId)
            .orElseThrow{ CourseNotFoundException("Not found course with id $courseId") }


        return flashCardRepository.findByCourseAndId(course, flashCardId)
            .map(::mapToDTO)
            .orElseThrow { FlashCardNotFoundException("Not found flash card with id $flashCardId and course with id $courseId") }
    }

    fun updateFlashCard(courseId: Int, flashCardId: Int, flashCardDto: FlashCardDTO): FlashCardDTO {
        val course = courseRepository.findById(courseId)
            .orElseThrow{ CourseNotFoundException("Not found course with id $courseId") }

        val flashCard = mapToEntity(flashCardDto, course)

        val updatedFlashCard = flashCardRepository.save(flashCard)

        return mapToDTO(updatedFlashCard)
    }

    fun deleteFlashCard(courseId: Int, flashCardId: Int) {
        if (!courseRepository.existsById(courseId)) {
            throw CourseNotFoundException("Not found course with id $courseId")
        }

        flashCardRepository.deleteByCourseIdAndId(courseId, flashCardId)
    }

    private fun mapToDTO(flashCard: FlashCard): FlashCardDTO =
        with(flashCard) { FlashCardDTO(id, valueA, valueB) }

    private fun mapToEntity(flashCardDto: FlashCardDTO, course: Course): FlashCard =
        with(flashCardDto) { FlashCard(id, course, valueA, valueB) }
}
