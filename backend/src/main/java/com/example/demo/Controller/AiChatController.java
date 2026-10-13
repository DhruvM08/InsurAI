package com.example.demo.Controller;

import com.example.demo.Object.ai.AiChatRequest;
import com.example.demo.Object.ai.AiChatResponse;
import com.example.demo.Service.AiChatService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.Map;

@RestController
@RequestMapping("/InsureAi/ai")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AiChatController {

    private final AiChatService aiChatService;

    public AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(AiChatResponse.failure("Message cannot be empty."));
        }
        AiChatResponse response = aiChatService.chat(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(@RequestBody AiChatRequest request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return Flux.just("Message cannot be empty.");
        }
        return aiChatService.streamChat(request);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Spring AI Chat Engine",
                "provider", "Groq (Llama-3.3-70b-versatile)"
        ));
    }
}
