package com.memento.course

import com.memento.flashcards.FlashCard
import com.memento.security.UserInfo
import jakarta.persistence.*

@Entity
@Table(name = "courses")
class Course(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    @Column(name = "name")
    var name: String,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    val author: UserInfo,

    @Column(name = "language_a")
    var languageA: String,

    @Column(name = "language_b")
    var languageB: String,

    @OneToMany(mappedBy = "course", fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @OrderBy("id")
    val flashCards: Set<FlashCard> = mutableSetOf()
)
