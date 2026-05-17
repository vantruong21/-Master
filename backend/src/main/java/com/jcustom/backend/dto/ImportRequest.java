package com.jcustom.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ImportRequest {
    private String title;
    private String description;
    private List<CardDto> cards;

    @Data
    public static class CardDto {
        private String prompt;
        private String answer;
        private String hint;
        private String type; // VOCAB, KANJI, GRAMMAR
    }
}
