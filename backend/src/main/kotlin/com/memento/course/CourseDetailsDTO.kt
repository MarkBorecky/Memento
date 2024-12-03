package com.memento.course

import com.fasterxml.jackson.annotation.JsonUnwrapped
import com.memento.learning.LearningDetails

data class CourseDetailsDTO(
    @JsonUnwrapped val progressInfo: LearningDetails,
    @JsonUnwrapped val courseDetails: CourseDTO
) {
}