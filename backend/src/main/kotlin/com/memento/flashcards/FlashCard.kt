package com.memento.flashcards

import com.memento.course.Course
import jakarta.persistence.*

@Entity
@Table(name = "flash_cards")
class FlashCard(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int,
    @ManyToOne
    @JoinColumn(table="flash_cards", name="course_id", nullable=false)
    var course: Course,
    @Column(name = "value_a") var valueA: String,
    @Column(name = "value_b") var valueB: String
) {

}