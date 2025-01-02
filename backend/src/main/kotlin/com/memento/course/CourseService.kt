package com.memento.course

import com.memento.security.UserInfo
import com.memento.security.UserInfoRepository
import com.memento.user.UserNotFoundException
import org.springframework.stereotype.Service
import java.security.Principal

@Service
class CourseService(
    private val courseRepository: CourseRepository,
    private val userInfoRepository: UserInfoRepository
) {

    fun addCourse(courseDTO: CourseDTO, principal: Principal): CourseDTO {
        val author = userInfoRepository.findByUserName(principal.name)
            .orElseThrow{ throw UserNotFoundException("User with name ${principal.name} not found") }
        val course = mapToEntity(courseDTO, author)
        val savedCourse = courseRepository.save(course)
        return CourseDTO(savedCourse)
    }

    fun getAll(): List<CourseDTO> = courseRepository.findAll().map{ CourseDTO(it) }

    fun getById(courseId: Int): CourseFullDTO = courseRepository.findById(courseId)
        .map { CourseFullDTO(it) }
        .orElseThrow { CourseNotFoundException("Not found course with id $courseId") }

    fun updateCourse(courseId: Int, courseDTO: CourseDTO, principal: Principal): CourseDTO {
        if (!courseRepository.existsById(courseId)) {
            throw CourseNotFoundException("Not found course with id $courseId")
        }
        val author = userInfoRepository.findByUserName(principal.name)
            .orElseThrow{ throw UserNotFoundException("User with name ${principal.name} not found") }
        val course = mapToEntity(courseDTO, author, courseId)
        val updatedCourse = courseRepository.save(course)
        return CourseDTO(updatedCourse)
    }

    fun deleteCourse(courseId: Int) = courseRepository.deleteById(courseId)

    private fun mapToEntity(dto: CourseDTO, author: UserInfo, courseId: Int = 0): Course =
        with(dto) { Course(courseId, name, author, languageA, languageB) }
}
