package com.memento.course

import org.springframework.web.bind.annotation.*

@RestController
class CourseController(private val courseService: CourseService) {

    @PostMapping("/courses")
    fun addCourse(@RequestBody course: Course): Course = courseService.addCourse(course)

    @GetMapping("/courses")
    fun getCourses(): List<Course> = courseService.getAll()

    @GetMapping("/courses/{courseId}")
    fun getCourseById(@PathVariable courseId: Int): Course = courseService.getById(courseId)

}