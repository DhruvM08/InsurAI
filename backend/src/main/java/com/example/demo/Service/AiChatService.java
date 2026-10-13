package com.example.demo.Service;

import com.example.demo.Object.Policy;
import com.example.demo.Object.PolicyOffering;
import com.example.demo.Object.SignupDTO;
import com.example.demo.Object.ai.AiChatRequest;
import com.example.demo.Object.ai.AiChatResponse;
import com.example.demo.Object.ai.ChatMessageDTO;
import com.example.demo.Repo.PolicyOfferingRepo;
import com.example.demo.Repo.PolicyRepo;
import com.example.demo.Repo.UserDTOREPO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AiChatService {

    private static final Logger logger = LoggerFactory.getLogger(AiChatService.class);

    private final ChatClient chatClient;
    private final PolicyRepo policyRepo;
    private final PolicyOfferingRepo policyOfferingRepo;
    private final UserDTOREPO userRepo;

    public AiChatService(
            ChatClient chatClient,
            PolicyRepo policyRepo,
            PolicyOfferingRepo policyOfferingRepo,
            UserDTOREPO userRepo
    ) {
        this.chatClient = chatClient;
        this.policyRepo = policyRepo;
        this.policyOfferingRepo = policyOfferingRepo;
        this.userRepo = userRepo;
    }

    public AiChatResponse chat(AiChatRequest request) {
        String conversationId = (request.getConversationId() != null && !request.getConversationId().isBlank())
                ? request.getConversationId()
                : UUID.randomUUID().toString();

        try {
            String systemContext = buildSystemContext(request.getUserEmail());
            String userPrompt = buildUserPrompt(request);

            logger.info("Processing AI Chat request for conversationId: {}, userEmail: {}",
                    conversationId, request.getUserEmail());

            String reply = chatClient.prompt()
                    .system(systemContext)
                    .user(userPrompt)
                    .call()
                    .content();

            return AiChatResponse.of(reply, conversationId);

        } catch (Exception e) {
            logger.error("Error generating AI chat response: {}", e.getMessage(), e);
            return AiChatResponse.failure(
                    "I am temporarily having trouble connecting to my advisory engine. Please try again shortly or contact support at insurai02@gmail.com."
            );
        }
    }

    public Flux<String> streamChat(AiChatRequest request) {
        try {
            String systemContext = buildSystemContext(request.getUserEmail());
            String userPrompt = buildUserPrompt(request);

            logger.info("Streaming AI Chat request for userEmail: {}", request.getUserEmail());

            return chatClient.prompt()
                    .system(systemContext)
                    .user(userPrompt)
                    .stream()
                    .content();

        } catch (Exception e) {
            logger.error("Error streaming AI chat response: {}", e.getMessage(), e);
            return Flux.just("Error streaming response. Please try again later.");
        }
    }

    private String buildSystemContext(String userEmail) {
        StringBuilder context = new StringBuilder("""
                You are InsuAI Assistant, the flagship AI advisory agent for the InsurAI platform.
                
                Platform Overview:
                - InsurAI is a full-stack insurance management system connecting Policyholders, Certified Agents, and Administrators.
                - Users can explore insurance plans, apply for coverage, schedule consultations with agents, and track claims/policies.
                - Agents publish policy offerings, review user applications, and manage consultation appointments.
                - Administrators monitor system health, oversee approvals, and review customer feedback.
                
                Policy Portfolios Supported:
                - Health: Comprehensive Individual, Family Floater Plus, Senior Citizen Health Protection.
                - Life: Term Life, Whole Life Coverage, Critical Illness Add-ons.
                - Auto: Comprehensive Vehicle, Third-Party Liability, Roadside Assistance.
                - Commercial / SME: Business Owner Protection, Property & Casualty.
                
                Operational Rules:
                1. Always prioritize user clarity and financial protection.
                2. If the user has active policies or appointments, tailor your recommendations to complement their current portfolio.
                3. Direct users to the 'Agents' tab to book one-on-one appointments for formal policy issuance or claims processing.
                4. Maintain a warm, authoritative, and professional tone.
                """);

        if (userEmail != null && !userEmail.isBlank()) {
            context.append("\n=== Current User Profile ===\n");
            context.append("Email: ").append(userEmail).append("\n");

            Optional<SignupDTO> userOpt = userRepo.findByEmail(userEmail);
            userOpt.ifPresent(u -> {
                if (u.getName() != null) {
                    context.append("Name: ").append(u.getName()).append("\n");
                }
            });

            // Enriched context from MongoDB: User's actual policies
            try {
                List<Policy> activePolicies = policyRepo.findByUserEmail(userEmail);
                if (activePolicies != null && !activePolicies.isEmpty()) {
                    context.append("Active Policies:\n");
                    for (Policy p : activePolicies) {
                        context.append("- ").append(p.getPolicyTypeName())
                                .append(" (Status: ").append(p.getStatus()).append(")\n");
                    }
                } else {
                    context.append("Active Policies: None currently enrolled\n");
                }
            } catch (Exception ex) {
                logger.warn("Could not fetch user policies for AI context: {}", ex.getMessage());
            }

            // Available catalog offerings
            try {
                List<PolicyOffering> offerings = policyOfferingRepo.findAll();
                if (offerings != null && !offerings.isEmpty()) {
                    context.append("\nCurrently Offered Plans in Catalog:\n");
                    for (PolicyOffering o : offerings) {
                        context.append("- ").append(o.getPolicyName())
                                .append(" (Type: ").append(o.getType())
                                .append(", Premium: ").append(o.getPremium()).append(")\n");
                    }
                }
            } catch (Exception ex) {
                logger.warn("Could not fetch policy offerings for AI context: {}", ex.getMessage());
            }
        }

        return context.toString();
    }

    private String buildUserPrompt(AiChatRequest request) {
        StringBuilder sb = new StringBuilder();

        if (request.getHistory() != null && !request.getHistory().isEmpty()) {
            sb.append("Recent Conversation History:\n");
            // Include up to last 8 turns
            int start = Math.max(0, request.getHistory().size() - 8);
            for (int i = start; i < request.getHistory().size(); i++) {
                ChatMessageDTO msg = request.getHistory().get(i);
                String role = "user".equalsIgnoreCase(msg.getRole()) ? "User" : "Assistant";
                sb.append(role).append(": ").append(msg.getContent()).append("\n");
            }
            sb.append("\n");
        }

        sb.append("Current User Question:\n").append(request.getMessage());
        return sb.toString();
    }
}
