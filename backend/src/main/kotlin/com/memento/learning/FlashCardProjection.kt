package com.memento.learning

data class FlashCardProjection(
    val courseId: Int,
    val userId: Int,
    val flashCardId: Int,
    val correctAnswerCount: Int,
    val valueA: String,
    val valueB: String
)
