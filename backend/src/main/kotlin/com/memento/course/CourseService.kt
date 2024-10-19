package com.memento.course

import org.springframework.stereotype.Service

@Service
class CourseService(private val courseRepository: CourseRepository) {
    fun addCourse(course: Course): Course = courseRepository.save(course)

}
