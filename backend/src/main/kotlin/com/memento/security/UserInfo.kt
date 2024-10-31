package com.memento.security

import com.memento.course.Course
import jakarta.persistence.*

@Entity
@Table(name = "users")
class UserInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int,
    var userName: String,
    var password: String,
    var email: String,
    @ManyToMany(targetEntity = Role::class, fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @JoinTable(
        name = "user_roles",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "role_id")]
    )
    val roles: Set<Role> = mutableSetOf(),

    @ManyToMany(targetEntity = Course::class, fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @JoinTable(
        name = "user_learning_courses",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "course_id")]
    )
    private val learningCourse: Set<Course> = mutableSetOf()
) {
    fun addLearCourse(course: Course) {
        this.learningCourse.plus(course)
    }
}
