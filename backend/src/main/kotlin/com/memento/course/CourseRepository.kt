package com.memento.course

import org.springframework.data.jpa.repository.JpaRepository

interface CourseRepository: JpaRepository<Course, Int> {

}
