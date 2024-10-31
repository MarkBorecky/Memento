package com.memento.learningcourse

import com.memento.user.UserDTO
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class LearningCourseController(private val learningCourseService: LearningCourseService) {

    @PatchMapping("/users/{userId}/courses/{courseId}")
    fun addCourseToUsersLearningCourses(@PathVariable userId: Int, @PathVariable courseId: Int): UserDTO =
        learningCourseService.addCourseToUsersLearningCourses(userId, courseId)
}