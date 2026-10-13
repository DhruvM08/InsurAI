package com.example.demo.Object.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatRequest {
    private String message;
    private String userEmail;
    private String userName;
    private String conversationId;
    private List<ChatMessageDTO> history;
}
