package com.example.demo.Object;

import lombok.Data;

@Data
public class PolicyRequest {
    public String userEmail;
    public String agentEmail;
    public String typeId;
    public String policyTypeName;
    public java.util.Map<String, Object> formData;
}
