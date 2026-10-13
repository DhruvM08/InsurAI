package com.example.demo.Controller;

import com.example.demo.Object.ai.AiChatRequest;
import com.example.demo.Object.ai.AiChatResponse;
import com.example.demo.Service.AiChatService;
import com.example.demo.Service.PolicyRagService;
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
    private final PolicyRagService policyRagService;

    public AiChatController(AiChatService aiChatService, PolicyRagService policyRagService) {
        this.aiChatService = aiChatService;
        this.policyRagService = policyRagService;
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

    @PostMapping("/rag/reindex")
    public ResponseEntity<Map<String, Object>> reindexPolicyDocuments() {
        int count = policyRagService.ingestPolicyDocuments();
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "indexedChunks", count,
                "message", "Policy document knowledge base successfully vectorized and indexed into VectorStore"
        ));
    }

    @GetMapping("/rag/search")
    public ResponseEntity<Map<String, Object>> searchPolicyKnowledge(@RequestParam("query") String query) {
        PolicyRagService.RagResult result = policyRagService.retrieveRelevantClauses(query, 3);
        return ResponseEntity.ok(Map.of(
                "query", query,
                "citations", result.getCitations(),
                "hasContext", result.hasContext(),
                "retrievedSnippets", result.getContextText()
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Spring AI + Vector RAG Engine",
                "provider", "Groq (Llama-3.3-70b-versatile)",
                "embedding", "Transformers in-process (all-MiniLM-L6-v2)",
                "vectorStore", "SimpleVectorStore"
        ));
    }
}
