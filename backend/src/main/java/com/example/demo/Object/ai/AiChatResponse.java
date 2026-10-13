package com.example.demo.Object.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponse {
    private boolean success;
    private String reply;
    private String conversationId;
    private List<String> sources;
    private String timestamp;

    public static AiChatResponse of(String reply, String conversationId) {
        return AiChatResponse.builder()
                .success(true)
                .reply(reply)
                .conversationId(conversationId)
                .timestamp(Instant.now().toString())
                .build();
    }

    public static AiChatResponse failure(String errorMessage) {
        return AiChatResponse.builder()
                .success(false)
                .reply(errorMessage)
                .timestamp(Instant.now().toString())
                .build();
    }
}
