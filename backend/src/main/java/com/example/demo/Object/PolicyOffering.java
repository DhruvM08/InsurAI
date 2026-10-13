package com.example.demo.Object;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection = "policy_offerings")
@Data
public class PolicyOffering {
    @Id
    private String id;

    private String policyName;
    private String type; // Life, Health, Auto, Home
    private String description;
    private String coverageAmount;
    private String premium;
    private List<String> features;

    // Agent/Company Details
    private String agentName;
    private String agentEmail;
    private String companyName;

    private Instant createdAt;
}
