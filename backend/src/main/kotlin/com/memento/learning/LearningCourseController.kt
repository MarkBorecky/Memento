package com.memento.learning

import com.memento.course.CourseDetailsDTO
import com.memento.user.UserDTO
import org.springframework.web.bind.annotation.*

@RestController
class LearningController(private val learningService: LearningService) {

    @GetMapping("/users/{userId}/courses")
    fun getUserLearningCourses(@PathVariable userId: Int): List<CourseDetailsDTO> =
        learningService.getUserLearningCourses(userId)

    @PatchMapping("/users/{userId}/courses/{courseId}")
    fun addCourseToUsersLearningCourses(@PathVariable userId: Int, @PathVariable courseId: Int): UserDTO =
        learningService.addCourseToUsersLearningCourses(userId, courseId)

    @GetMapping("/users/{userId}/courses/{courseId}")
    fun getFlashCardsForLearningSession(
        @PathVariable userId: Int,
        @PathVariable courseId: Int,
        @RequestParam(defaultValue = "5") size: Int
    ): List<LearningFlashCardDTO> = learningService.getLearningFlashCardSet(userId, courseId, size)

    @PostMapping("/users/{userId}/courses/{courseId}")
    fun saveLearningProgress(
        @PathVariable userId: Int,
        @PathVariable courseId: Int,
        @RequestBody progress: ProgressRequestDTO
    ) {
        learningService.saveLearningProgress(userId, courseId, progress)
    }
}