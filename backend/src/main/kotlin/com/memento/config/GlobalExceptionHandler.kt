package com.memento.config

import com.memento.course.exceptions.CourseNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import java.util.*

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(CourseNotFoundException::class)
    fun handleCourseNotFoundException(e: CourseNotFoundException, request: WebRequest): ResponseEntity<ErrorDetails> {
        val errorDetails = ErrorDetails(Date(), e.message, request.getDescription(false))
        return ResponseEntity(errorDetails, HttpStatus.NOT_FOUND)
    }

    data class ErrorDetails(val date: Date, val message: String?, val description: String)
}