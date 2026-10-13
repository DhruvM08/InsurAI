package com.example.demo.Object;

import lombok.Data;

@Data
public class UserAppointmentResponse {
    private String agentName;
    private String agentEmail;
    private Schedule schedule;
}
