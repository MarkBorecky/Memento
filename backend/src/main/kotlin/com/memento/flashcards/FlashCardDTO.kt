package com.memento.flashcards

data class FlashCardDTO(val id: Int, val valueA: String, val valueB: String) {
    constructor(FlashCard: FlashCard) : this(FlashCard.id, FlashCard.valueA, FlashCard.valueB)
}