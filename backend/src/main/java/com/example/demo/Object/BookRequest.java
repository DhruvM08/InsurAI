package com.example.demo.Object;

import lombok.Data;

@Data
public class BookRequest {
    public String agentEmail;
    public String scheduleId;
    public String userEmail;
    public String userNote;
    public String date;
    public String startTime;
    public String endTime;
    public String appointmentType;
}
