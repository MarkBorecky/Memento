package com.memento.course

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class CourseController(private val courseService: CourseService) {

    @PostMapping("/courses")
    fun addCourse(@RequestBody course: Course): Course = courseService.addCourse(course)



}