package com.memento.learning

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
class LearningCourseFlashCardId(
    @Column(name = "user_id")
    val userId: Int,
    @Column(name = "course_id")
    val courseId: Int,
    @Column(name = "flash_card_id")
    val flashCardId: Int
)