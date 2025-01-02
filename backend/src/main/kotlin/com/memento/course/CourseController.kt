package com.memento.course

import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class CourseController(private val courseService: CourseService) {

    @PostMapping("/courses")
    fun addCourse(@RequestBody course: CourseDTO, principal: Principal): CourseDTO = courseService.addCourse(course, principal)

    @GetMapping("/courses")
    fun getCourses(): List<CourseDTO> = courseService.getAll()

    @GetMapping("/courses/{courseId}")
    fun getCourseById(@PathVariable courseId: Int): CourseFullDTO = courseService.getById(courseId)

    @PutMapping("/courses/{courseId}")
    fun updateCourseById(@PathVariable courseId: Int, @RequestBody course: CourseDTO, principal: Principal): CourseDTO =
        courseService.updateCourse(courseId, course, principal)

    @DeleteMapping("/courses/{courseId}")
    fun deleteCourse(@PathVariable courseId: Int) = courseService.deleteCourse(courseId)

}