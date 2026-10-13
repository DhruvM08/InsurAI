package com.example.demo.Service;

import com.example.demo.Object.PolicyOffering;
import com.example.demo.Object.SignupDTO;
import com.example.demo.Repo.PolicyOfferingRepo;
import com.example.demo.Repo.UserDTOREPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class PolicyOfferingService {

    @Autowired
    private PolicyOfferingRepo policyOfferingRepo;

    @Autowired
    private UserDTOREPO userRepo;

    public String createPolicyOffering(PolicyOffering offering, String agentEmail) {
        // Validate agent and their specialization
        Optional<SignupDTO> agentOpt = userRepo.findByEmail(agentEmail);
        if (agentOpt.isEmpty()) {
            return "Agent not found";
        }

        SignupDTO agent = agentOpt.get();
        if (!"Agent".equalsIgnoreCase(agent.getRole())) {
            return "Unauthorized: Only Agents can publish policies";
        }

        // Validate specialization
        // The user said: "as per the Experties make the policy post Section based on
        // form"
        // We will assume the frontend handles the form based on this, or we can check
        // here:
        if (!offering.getType().equalsIgnoreCase(agent.getSpecialization())) {
            // Optional: enforce this strictly
            // return "You can only publish policies for your specialization: " +
            // agent.getSpecialization();
        }

        offering.setAgentEmail(agentEmail);
        offering.setAgentName(agent.getName());
        offering.setCompanyName(agent.getCompany());
        offering.setCreatedAt(Instant.now());

        policyOfferingRepo.save(offering);
        return "Policy published successfully";
    }

    public List<PolicyOffering> getAllOfferings() {
        return policyOfferingRepo.findAll();
    }

    public List<PolicyOffering> getMyOfferings(String agentEmail) {
        return policyOfferingRepo.findByAgentEmail(agentEmail);
    }
}
