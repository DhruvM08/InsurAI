package com.example.demo.Service;

import com.example.demo.Object.Policy;
import com.example.demo.Repo.PolicyRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.example.demo.Object.PolicyApplyForm;
import com.example.demo.Object.Notification;
import com.example.demo.Repo.NotificationRepo;
import com.example.demo.Service.EmailService;

import java.time.Instant;
import java.util.List;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepo policyRepo;

    @Autowired
    private com.example.demo.Repo.PolicyApplyFormRepo policyApplyFormRepo;

    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private EmailService emailService;

    @Value("${mail.username}")
    private String adminEmail;

    public Policy applyForPolicy(String userEmail, String agentEmail, String typeId, String policyTypeName,
            java.util.Map<String, Object> formData) {

        // Other Details Saving --------------------
        Policy policy = new Policy();
        policy.setUserEmail(userEmail);
        policy.setAgentEmail(agentEmail); // Set agent responsible
        policy.setTypeId(typeId);
        policy.setPolicyTypeName(policyTypeName);
        policy.setFormData(formData);
        policy.setStatus("PENDING");
        policy.setAppliedAt(Instant.now());
        policy.setUpdatedAt(Instant.now());
        Policy savedPolicy = policyRepo.save(policy);

        // Notify User
        notificationRepo.save(new Notification(userEmail, "Application Submitted",
                "Your application for " + policyTypeName + " has been received. Our agent will review it soon.",
                "INFO"));
        emailService.sendEmail(userEmail, "Application Received - InsurAI",
                "We have received your application for " + policyTypeName + ". Reference ID: " + savedPolicy.getId());

        // Notify Agent
        if (agentEmail != null && !agentEmail.isEmpty()) {
            notificationRepo.save(new Notification(agentEmail, "New Application Assigned",
                    "User " + userEmail + " has applied for your policy: " + policyTypeName, "WARNING"));
            emailService.sendEmail(agentEmail, "New Policy Application Received",
                    "Hello Agent,\n\nYou have a new policy application from " + userEmail + " for " + policyTypeName
                            + ".\nPlease review it in your dashboard.");
        }

        // 2. Notify Admin
        notificationRepo.save(new Notification(adminEmail, "New Policy Application",
                "User " + userEmail + " applied for " + policyTypeName + " through agent " + agentEmail, "WARNING"));
        // ---------------------------------

        // Form data saving for apply in policy
        PolicyApplyForm form = new PolicyApplyForm();
        form.setUserEmail(userEmail);
        form.setTypeId(typeId);
        form.setPolicyTypeName(policyTypeName);
        form.setFormData(formData);
        form.setSubmittedAt(Instant.now());
        policyApplyFormRepo.save(form);

        return savedPolicy;
    }

    // a list of policies associated with user
    public List<Policy> getUserPolicies(String userEmail) {
        return policyRepo.findByUserEmail(userEmail);
    }

    // get All policies
    public List<Policy> getAllPolicies() {
        return policyRepo.findAll();
    }

    // get policies by agent
    public List<Policy> getPoliciesByAgent(String agentEmail) {
        return policyRepo.findByAgentEmail(agentEmail);
    }

    // get policies by specialization
    public List<Policy> getPoliciesBySpecialization(String specialization) {
        return policyRepo.findByPolicyTypeNameStartingWithIgnoreCase(specialization);
    }

    // Update the policy status as per approval
    public Policy updatePolicyStatus(String policyId, String status, String comments) {
        Policy policy = policyRepo.findById(policyId).orElse(null);
        if (policy != null) {
            policy.setStatus(status);
            policy.setAgentComments(comments);
            policy.setUpdatedAt(Instant.now());

            Policy updatedPolicy = policyRepo.save(policy);

            // --- NOTIFICATION LOGIC ---
            String notifType = status.contains("APPROVED") ? "SUCCESS" : "ERROR";
            String userMsg = "Your policy status has been updated to: " + status;

            // Notify User
            notificationRepo
                    .save(new Notification(policy.getUserEmail(), "Policy Update: " + status, userMsg, notifType));
            emailService.sendEmail(policy.getUserEmail(), "Policy Status Update", userMsg + "\nComments: " + comments);
            // ---------------------------------

            return updatedPolicy;
        }
        return null;
    }
}
