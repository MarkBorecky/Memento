package com.memento.learning

import com.memento.course.CourseDetailsDTO

interface CustomLearningFlashCardRepository {

    fun findFlashCardsToLearnByUserAndCourse(userId: Int, courseId: Int, learntAnswerCountBorder: Int, size: Int): List<FlashCardProjection>

    fun getAllLearningCoursesWithDetailsByUserid(userId: Int): List<CourseDetailsDTO>


}
