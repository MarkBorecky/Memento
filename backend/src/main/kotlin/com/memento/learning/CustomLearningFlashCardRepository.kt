package com.memento.learning

interface CustomLearningFlashCardRepository {

    fun findFlashCardsToLearnByUserAndCourse(userId: Int, courseId: Int, learntAnswerCountBorder: Int, size: Int): List<FlashCardProjection>;


}
