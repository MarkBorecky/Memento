package com.memento.learning

import com.memento.flashcards.FlashCard
import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "learning_flash_cards")
class LearningFlashCard(
    @EmbeddedId
    val id: LearningCourseFlashCardId,

    @ManyToOne
    @JoinColumn(name = "flash_card_id", insertable = false, updatable = false)
    val flashCard: FlashCard,

    @Enumerated(EnumType.STRING)
    val stage: LearningStage,

    val lastCorrectAnswer: Instant,
    val nextAskingTime: Instant
) {

}
