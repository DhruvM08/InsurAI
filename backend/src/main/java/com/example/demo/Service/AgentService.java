package com.example.demo.Service;

import com.example.demo.Object.AgentResponse;
import com.example.demo.Object.Schedule;
import com.example.demo.Object.SignupDTO;
import com.example.demo.Repo.ScheduleRepo;
import com.example.demo.Repo.UserDTOREPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Object.Notification;
import com.example.demo.Repo.NotificationRepo;
import com.example.demo.Service.EmailService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AgentService {

    @Autowired
    private UserDTOREPO userDTOREPO;

    @Autowired
    private ScheduleRepo scheduleRepo;

    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.example.demo.Repo.FeedbackRepo feedbackRepo;

    // Agent Scheduling Service ----------------
    public String agentScheduling(Schedule schedule, String email) {

        if (!userDTOREPO.existsByEmail(email)) {
            return "User Not Found";
        }

        Schedule s1 = new Schedule();
        s1.setAgentEmail(email);
        s1.setDate(schedule.getDate());
        s1.setStatus(schedule.getStatus());
        s1.setStartTime(schedule.getStartTime());
        s1.setEndTime(schedule.getEndTime());
        s1.setAppointmentType(schedule.getAppointmentType());
        s1.setBookedByUserEmail(null);

        scheduleRepo.save(s1);

        return "Successfully scheduled";
    }

    // Fetch all agents with their availability ------------------------
    public List<AgentResponse> getAllAgentsWithAvailability() {
        List<SignupDTO> agents = userDTOREPO.findByRole("Agent");

        return agents.stream().map(agent -> {
            AgentResponse res = new AgentResponse();
            res.setId(agent.getId());
            res.setName(agent.getName());
            res.setEmail(agent.getEmail());
            res.setRole(agent.getRole());
            res.setCompany(agent.getCompany());
            res.setSpecialization(agent.getSpecialization());

            List<Schedule> schedules = scheduleRepo.findByAgentEmail(agent.getEmail());
            res.setAgentSchedule(schedules);

            // Calculate Rating -----------------------
            List<com.example.demo.Object.Feedback> feedbacks = feedbackRepo.findByAgentEmail(agent.getEmail());
            if (feedbacks != null && !feedbacks.isEmpty()) {
                double avg = feedbacks.stream()
                        .mapToInt(com.example.demo.Object.Feedback::getRating)
                        .average()
                        .orElse(0.0);

                // Round to 1 decimal place (e.g., 4.666 -> 4.7)
                double roundedAvg = Math.round(avg * 10.0) / 10.0;
                res.setRating(roundedAvg);
                System.out.println(
                        "Agent: " + agent.getEmail() + " | Feedbacks: " + feedbacks.size() + " | Avg: " + roundedAvg);
            } else {
                res.setRating(0.0);
            }

            return res;
        }).collect(Collectors.toList());
    }

    // Slot Booking by User --------------------------
    public String bookSchedule(String agentEmail,
            String scheduleId,
            String userEmail,
            String userNote,
            String startTime,
            String endTime,
            String appointmentType) {

        Optional<Schedule> scheduleOpt = scheduleRepo.findById(scheduleId);
        if (!scheduleOpt.isPresent()) {
            return "Slot not found";
        }

        Schedule s = scheduleOpt.get();

        if (!"Available".equalsIgnoreCase(s.getStatus())) {
            return "Slot not available or already booked";
        }

        s.setStatus("Booked");
        s.setBookedByUserEmail(userEmail);
        s.setUserNote(userNote);

        scheduleRepo.save(s);

        // --- ADDED: NOTIFICATION LOGIC ---
        // 1. Notify Agent
        notificationRepo.save(new Notification(agentEmail, "New Appointment Request",
                "User " + userEmail + " booked a slot on " + s.getDate(), "INFO"));
        emailService.sendEmail(agentEmail, "New Appointment Booking",
                "You have a new appointment with " + userEmail + ".\nNote: " + userNote);

        // 2. Notify User
        notificationRepo.save(new Notification(userEmail, "Booking Confirmed",
                "Your appointment with " + agentEmail + " is confirmed.", "SUCCESS"));
        emailService.sendEmail(userEmail, "Appointment Confirmation",
                "Your appointment is confirmed for " + s.getDate() + " at " + startTime);
        // ---------------------------------

        return "Slot booked successfully";
    }

    // All Booked Appointment of Agent in Agent Dashboard(My Appointments)
    // ------------------------------------------
    public List<Schedule> getAgentBookedRequests(String agentEmail) {
        List<Schedule> allSchedules = scheduleRepo.findByAgentEmail(agentEmail);

        return allSchedules.stream()
                .filter(s -> s.getBookedByUserEmail() != null && !s.getBookedByUserEmail().isEmpty())
                // Return interactions
                .collect(Collectors.toList());
    }

    // Schedule Status Update ----------------------------------------------
    public String updateScheduleStatus(String agentEmail, String scheduleId, String newStatus) {

        Optional<Schedule> schedule = scheduleRepo.findById(scheduleId);
        if (!schedule.isPresent())
            return "Schedule not found";

        Schedule s = schedule.get();
        if (!agentEmail.equalsIgnoreCase(s.getAgentEmail())) {
            return "Unauthorized access to schedule";
        }

        // --- ADDED: NOTIFICATION LOGIC ---
        // Notify User about the change
        if (s.getBookedByUserEmail() != null) {
            String type = "CONFIRMED".equalsIgnoreCase(newStatus) ? "SUCCESS" : "WARNING";
            notificationRepo.save(new Notification(s.getBookedByUserEmail(), "Appointment Update",
                    "Agent has marked your appointment as " + newStatus, type));
            emailService.sendEmail(s.getBookedByUserEmail(), "Appointment Update", "Status changed to: " + newStatus);
        }
        // ---------------------------------

        s.setStatus(newStatus);
        scheduleRepo.save(s);
        return "Status updated to " + newStatus;
    }

    // For All Booked Schedule -----------------------------
    public List<Schedule> getAllBookedSchedules() {
        return scheduleRepo.findAll().stream()
                .filter(s -> s.getBookedByUserEmail() != null && !s.getBookedByUserEmail().isEmpty())
                .collect(Collectors.toList());
    }
}
