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
) {

    constructor(stringId: String) : this(
        // Przetwarzamy `stringId` na trzy warto?ci Int
        userId = stringId.split("-").getOrNull(0)?.toIntOrNull()
            ?: throw IllegalArgumentException("Invalid userId in stringId: $stringId"),
        courseId = stringId.split("-").getOrNull(1)?.toIntOrNull()
            ?: throw IllegalArgumentException("Invalid courseId in stringId: $stringId"),
        flashCardId = stringId.split("-").getOrNull(2)?.toIntOrNull()
            ?: throw IllegalArgumentException("Invalid flashCardId in stringId: $stringId")
    )


    override fun toString(): String {
        return "$userId-$courseId-$flashCardId)"
    }
}