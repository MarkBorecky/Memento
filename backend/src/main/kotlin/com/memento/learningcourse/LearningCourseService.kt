package com.memento.learningcourse

import com.memento.course.CourseDTO
import com.memento.course.CourseRepository
import com.memento.security.UserInfoRepository
import com.memento.user.UserDTO
import com.memento.user.UserNotFoundException
import org.springframework.stereotype.Service

@Service
class LearningCourseService(
    private val courseRepository: CourseRepository,
    private val userRepository: UserInfoRepository,
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
}
