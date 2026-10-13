package com.example.demo.Object;

import java.time.LocalDate;
import java.time.LocalTime;

public class Schedule {
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    @org.springframework.data.annotation.Id
    private String id;

    private String status; // "AVAILABLE", "BOOKED"
    private String bookedByUserEmail;
    private String userNote;
    private String agentEmail;
    private String appointmentType;
    private boolean reminderSent;

    // --- GETTERS AND SETTERS ---
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBookedByUserEmail() {
        return bookedByUserEmail;
    }

    public void setBookedByUserEmail(String bookedByUserEmail) {
        this.bookedByUserEmail = bookedByUserEmail;
    }

    public String getUserNote() {
        return userNote;
    }

    public void setUserNote(String userNote) {
        this.userNote = userNote;
    }

    public String getAgentEmail() {
        return agentEmail;
    }

    public void setAgentEmail(String agentEmail) {
        this.agentEmail = agentEmail;
    }

    public String getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(String appointmentType) {
        this.appointmentType = appointmentType;
    }

    public boolean isReminderSent() {
        return reminderSent;
    }

    public void setReminderSent(boolean reminderSent) {
        this.reminderSent = reminderSent;
    }
}