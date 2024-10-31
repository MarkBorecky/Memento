package com.memento.learningcourse

import com.memento.course.CourseRepository
import com.memento.security.UserInfoRepository
import com.memento.user.UserDTO
import org.springframework.stereotype.Service

@Service
class LearningCourseService(
    private val courseRepository: CourseRepository,
    private val userRepository: UserInfoRepository
) {
    fun addCourseToUsersLearningCourses(userId: Int, courseId: Int): UserDTO {
        val userReference = userRepository.getReferenceById(userId)
        val courseReference = courseRepository.getReferenceById(userId)

        userReference.addLearCourse(courseReference)

        val savedUser = userRepository.save(userReference)

        return UserDTO(savedUser)
    }

}
