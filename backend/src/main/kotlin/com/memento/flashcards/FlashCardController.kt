package com.memento.flashcards

import org.springframework.web.bind.annotation.*

@RestController
class FlashCardController(val flashCardService: FlashCardService) {

    @GetMapping("/courses/{courseId}/flash-cards")
    fun getAllFlashcardsByCourse(
        @PathVariable courseId: Int
    ): List<FlashCardDTO> =
        flashCardService.getAllFlashCardsByCourse(courseId)

    @GetMapping("/courses/{courseId}/flash-cards/{flashCardId}")
    fun getFlashcardByCourseAndById(@PathVariable courseId: Int, @PathVariable flashCardId: Int): FlashCardDTO =
        flashCardService.getByCourseAndById(courseId, flashCardId)

    @PostMapping("/courses/{courseId}/flash-cards")
    fun addFlashcard(
        @RequestBody flashCardDto: FlashCardDTO,
        @PathVariable courseId: Int
    ): FlashCardDTO = flashCardService.addFlashCard(flashCardDto, courseId)

    @PutMapping("/courses/{courseId}/flash-cards/{flashCardId}")
    fun updateFlashcard(
        @PathVariable courseId: Int,
        @PathVariable flashCardId: Int,
        @RequestBody flashCardDto: FlashCardDTO
    ): FlashCardDTO = flashCardService.updateFlashCard(courseId, flashCardId, flashCardDto)


    @DeleteMapping("/courses/{courseId}/flash-cards/{flashCardId}")
    fun deleteFlashcard(
        @PathVariable courseId: Int,
        @PathVariable flashCardId: Int
    ) = flashCardService.deleteFlashCard(courseId, flashCardId)
}