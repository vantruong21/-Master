package com.jcustom.backend.service;

import com.jcustom.backend.entity.QuizSession;
import com.jcustom.backend.repository.QuizSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizSessionRepository quizSessionRepository;

    @Transactional
    public QuizSession saveSession(QuizSession session) {
        // Đảm bảo quan hệ hai chiều được thiết lập đúng cho QuizDetail
        if (session.getDetails() != null) {
            session.getDetails().forEach(detail -> detail.setQuizSession(session));
        }
        return quizSessionRepository.save(session);
    }
}
