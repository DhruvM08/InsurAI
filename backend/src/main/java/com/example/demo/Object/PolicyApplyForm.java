package com.example.demo.Object;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.Map;

@Document(collection = "policyApplyForm")
@Data
public class PolicyApplyForm {
    @Id
    private String id;
    private String userEmail;
    private String typeId;
    private String policyTypeName;
    private Map<String, Object> formData;
    private Instant submittedAt;

    public void setUserEmail(String email) { this.userEmail = email; }
    public void setTypeId(String id) { this.typeId = id; }
    public void setPolicyTypeName(String name) { this.policyTypeName = name; }
    public void setFormData(java.util.Map<String, Object> data) { this.formData = data; }
    public void setSubmittedAt(Instant date) { this.submittedAt = date; }
}
