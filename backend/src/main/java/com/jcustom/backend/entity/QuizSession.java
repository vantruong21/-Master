package com.jcustom.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "quiz_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "study_set_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"questions"})
    private StudySet studySet;

    private String mode; // TYPING, MCQ, GENIUS

    private Integer score;

    private Integer totalQuestions;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "quizSession", cascade = CascadeType.ALL)
    private List<QuizDetail> details;
}
