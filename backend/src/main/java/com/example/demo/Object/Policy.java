package com.example.demo.Object;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "policies")
@Data
public class Policy {
    @Id
    private String id;

    private String userEmail;
    private String agentEmail;
    private String typeId;
    private String policyTypeName;
    private String status; // PENDING, APPROVED, REJECTED, CHANGES_REQUESTED
    private String agentComments;
    private Instant appliedAt;
    private Instant updatedAt;
    private java.util.Map<String, Object> formData;

    public String getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getAgentEmail() {
        return agentEmail;
    }

    public void setAgentEmail(String agentEmail) {
        this.agentEmail = agentEmail;
    }

    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }

    public void setPolicyTypeName(String name) {
        this.policyTypeName = name;
    }

    public void setFormData(java.util.Map<String, Object> data) {
        this.formData = data;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAgentComments(String comments) {
        this.agentComments = comments;
    }

    public void setAppliedAt(Instant date) {
        this.appliedAt = date;
    }

    public void setUpdatedAt(Instant date) {
        this.updatedAt = date;
    }

}
