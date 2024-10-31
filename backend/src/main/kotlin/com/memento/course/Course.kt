package com.memento.course

import com.memento.flashcards.FlashCard
import jakarta.persistence.*

@Entity
@Table(name = "courses")
class Course(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Int,
    var name: String,
    @Column(name = "language_a") var languageA: String,
    @Column(name = "language_b") var languageB: String,
    @OneToMany(mappedBy = "course", fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    val flashCards: Set<FlashCard> = mutableSetOf()
)
