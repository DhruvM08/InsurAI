package com.example.demo.Object;

import lombok.Data;

@Data
public class UpdatePolicyRequest {
    public String policyId;
    public String status;
    public String comments;
}
