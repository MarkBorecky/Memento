package com.memento.course

import org.springframework.web.bind.annotation.*

@RestController
class CourseController(private val courseService: CourseService) {

    @PostMapping("/courses")
    fun addCourse(@RequestBody course: CourseDTO): CourseDTO = courseService.addCourse(course)

    @GetMapping("/courses")
    fun getCourses(): List<CourseDTO> = courseService.getAll()

    @GetMapping("/courses/{courseId}")
    fun getCourseById(@PathVariable courseId: Int): CourseFullDTO = courseService.getById(courseId)

    @PutMapping("/courses/{courseId}")
    fun updateCourseById(@PathVariable courseId: Int, @RequestBody course: CourseDTO): CourseDTO =
        courseService.updateCourse(courseId, course)

    @DeleteMapping("/courses/{courseId}")
    fun deleteCourse(@PathVariable courseId: Int) = courseService.deleteCourse(courseId)

}