package com.memento.learning

class FlashCardProgressDTO(
    val id: String,
    val correctAnswersCount: Int) {

    fun mapToLearningCourseFlashCardId(): LearningCourseFlashCardId {
        val ids: List<Int> = id.split("-").map { Integer.parseInt(it) };

        if (ids.size != 3) {
            throw Exception("Wrong id format")
        }

        val (userid, courseId, flashCardOd) = ids;
        return LearningCourseFlashCardId(userid, courseId, flashCardOd);
    }
}
