package com.example.demo.Controller;

import com.example.demo.Object.ai.AiChatRequest;
import com.example.demo.Object.ai.AiChatResponse;
import com.example.demo.Service.AiChatService;
import com.example.demo.Service.PolicyRagService;
import com.example.demo.ai.tools.InsurancePolicyTools;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/InsureAi/ai")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AiChatController {

    private final AiChatService aiChatService;
    private final PolicyRagService policyRagService;
    private final InsurancePolicyTools policyTools;

    public AiChatController(
            AiChatService aiChatService,
            PolicyRagService policyRagService,
            InsurancePolicyTools policyTools
    ) {
        this.aiChatService = aiChatService;
        this.policyRagService = policyRagService;
        this.policyTools = policyTools;
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

    @GetMapping("/tools/quote")
    public ResponseEntity<Map<String, Object>> getPremiumQuote(
            @RequestParam(defaultValue = "Health") String policyType,
            @RequestParam(defaultValue = "500000") double coverageAmount,
            @RequestParam(defaultValue = "30") int age,
            @RequestParam(defaultValue = "false") boolean smoker,
            @RequestParam(defaultValue = "false") boolean ped
    ) {
        String quote = policyTools.calculatePremiumQuote(policyType, coverageAmount, age, smoker, ped);
        return ResponseEntity.ok(Map.of(
                "quote", quote,
                "policyType", policyType,
                "coverageAmount", coverageAmount,
                "age", age
        ));
    }

    @GetMapping("/tools/agents")
    public ResponseEntity<Map<String, Object>> findAgents(
            @RequestParam(defaultValue = "Health") String specialization
    ) {
        String result = policyTools.findAvailableAgents(specialization);
        return ResponseEntity.ok(Map.of(
                "specialization", specialization,
                "agents", result
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Spring AI + Vector RAG + Tool Calling Agent",
                "provider", "Groq (Llama-3.3-70b-versatile)",
                "embedding", "Transformers in-process (all-MiniLM-L6-v2)",
                "vectorStore", "SimpleVectorStore",
                "registeredTools", List.of(
                        "checkUserPolicyStatus",
                        "findAvailableAgents",
                        "calculatePremiumQuote"
                )
        ));
    }
}
