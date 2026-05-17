package com.jcustom.backend.controller;

import com.jcustom.backend.entity.QuizSession;
import com.jcustom.backend.service.QuizService;
import com.jcustom.backend.repository.QuizSessionRepository;
import com.jcustom.backend.repository.QuizDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizService quizService;
    private final QuizSessionRepository quizSessionRepository;
    private final QuizDetailRepository quizDetailRepository;

    @PostMapping("/session")
    public ResponseEntity<QuizSession> saveSession(@RequestBody QuizSession session) {
        return ResponseEntity.ok(quizService.saveSession(session));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<QuizSession>> getAllSessions() {
        return ResponseEntity.ok(quizSessionRepository.findAllByOrderByStartTimeDesc());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSessions", quizSessionRepository.countSessions());
        stats.put("totalCorrect", quizSessionRepository.sumCorrect());
        stats.put("totalQuestions", quizSessionRepository.sumTotal());

        // Calculate streak in Java to avoid JPQL casting issues
        List<java.time.LocalDateTime> startTimes = quizSessionRepository.findAllStartTimes();
        List<java.time.LocalDate> dates = startTimes.stream()
                .filter(t -> t != null)
                .map(java.time.LocalDateTime::toLocalDate)
                .distinct()
                .collect(java.util.stream.Collectors.toList());

        int streak = 0;
        if (!dates.isEmpty()) {
            java.time.LocalDate today = java.time.LocalDate.now();
            // Check if user studied today or yesterday (streak still alive)
            if (dates.get(0).equals(today) || dates.get(0).equals(today.minusDays(1))) {
                streak = 1;
                for (int i = 1; i < dates.size(); i++) {
                    if (dates.get(i).equals(dates.get(i - 1).minusDays(1))) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }
        stats.put("streak", streak);
        stats.put("studyDates", dates);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/weak-points")
    public ResponseEntity<List<Map<String, Object>>> getWeakPoints() {
        List<Object[]> raw = quizDetailRepository.findWeakQuestions();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : raw) {
            Map<String, Object> item = new HashMap<>();
            item.put("questionId", row[0]);
            item.put("prompt", row[1]);
            item.put("answer", row[2]);
            item.put("wrongCount", row[3]);
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }
}
