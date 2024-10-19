package com.memento.course

import org.springframework.stereotype.Service
import java.util.*

@Service
class CourseService(private val courseRepository: CourseRepository) {
    fun addCourse(course: Course): Course = courseRepository.save(course)
    fun getAll(): List<Course> = courseRepository.findAll()
    fun getById(courseId: Int): Optional<Course> = courseRepository.findById(courseId)

}
