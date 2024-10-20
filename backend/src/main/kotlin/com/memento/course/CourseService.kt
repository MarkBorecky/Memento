package com.memento.course

import org.springframework.stereotype.Service

@Service
class CourseService(private val courseRepository: CourseRepository) {

    fun addCourse(courseDTO: CourseDTO): CourseDTO {
        val course = mapToEntity(courseDTO)
        val savedCourse = courseRepository.save(course)
        return mapToDTO(savedCourse)
    }

    fun getAll(): List<CourseDTO> = courseRepository.findAll().map(::mapToDTO)
    fun getById(courseId: Int): CourseDTO = courseRepository.findById(courseId)
        .map(::mapToDTO)
        .orElseThrow { CourseNotFoundException("Not found course with id $courseId") }

    fun updateCourse(courseId: Int, dto: CourseDTO): CourseDTO {
        if (!courseRepository.existsById(courseId)) {
            throw CourseNotFoundException("Not found course with id $courseId")
        }
        val course = mapToEntity(dto, courseId)
        val updatedCourse = courseRepository.save(course)
        return mapToDTO(updatedCourse)
    }

    fun deleteCourse(courseId: Int) = courseRepository.deleteById(courseId)

    private fun mapToDTO(course: Course): CourseDTO = with(course) { CourseDTO(id, name, languageA, languageB) }

    private fun mapToEntity(dto: CourseDTO, courseId: Int = 0): Course = with(dto) { Course(courseId, name, languageA, languageB) }
}
