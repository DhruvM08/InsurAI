package com.example.demo.Object;

import java.util.List;

public class AgentResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String company;
    private String specialization;
    private List<Schedule> agentSchedule;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public List<Schedule> getAgentSchedule() {
        return agentSchedule;
    }

    public void setAgentSchedule(List<Schedule> agentSchedule) {
        this.agentSchedule = agentSchedule;
    }

    private Double rating;

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}