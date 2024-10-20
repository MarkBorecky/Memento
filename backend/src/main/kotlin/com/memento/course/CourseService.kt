package com.memento.course

import com.memento.course.exceptions.CourseNotFoundException
import org.springframework.stereotype.Service

@Service
class CourseService(private val courseRepository: CourseRepository) {
    fun addCourse(course: Course): Course = courseRepository.save(course)
    fun getAll(): List<Course> = courseRepository.findAll()
    fun getById(courseId: Int): Course = courseRepository.findById(courseId)
        .orElseThrow { CourseNotFoundException("Not found course with id ${courseId}") }

}
