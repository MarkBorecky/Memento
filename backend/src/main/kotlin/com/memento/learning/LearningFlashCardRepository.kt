package com.memento.learning

import org.springframework.data.jpa.repository.JpaRepository

interface LearningFlashCardRepository : CustomLearningFlashCardRepository,
    JpaRepository<LearningFlashCard, LearningCourseFlashCardId> {

}
