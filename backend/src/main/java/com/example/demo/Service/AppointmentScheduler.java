package com.example.demo.Service;

import com.example.demo.Object.Notification;
import com.example.demo.Object.Schedule;
import com.example.demo.Repo.NotificationRepo;
import com.example.demo.Repo.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AppointmentScheduler {

    @Autowired
    private ScheduleRepo scheduleRepo;

    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private EmailService emailService;

    // Run every minute
    @Scheduled(fixedRate = 60000)
    public void checkUpcomingAppointments() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<Schedule> todaysSchedules = scheduleRepo.findAllByDate(today);

        for (Schedule schedule : todaysSchedules) {
            // Check if booked and not yet reminded
            if (schedule.getBookedByUserEmail() != null && !schedule.getBookedByUserEmail().isEmpty()
                    && !schedule.isReminderSent()) {

                // key status check - should be booked or confirmed
                String status = schedule.getStatus() != null ? schedule.getStatus().toUpperCase() : "";
                if (!status.contains("BOOKED") && !status.contains("CONFIRMED")) {
                    continue;
                }

                LocalTime startTime = schedule.getStartTime();
                if (startTime == null)
                    continue;

                long minutesUntil = ChronoUnit.MINUTES.between(now, startTime);

                // If within next 30 minutes (and not in the past)
                if (minutesUntil >= 0 && minutesUntil <= 30) {
                    sendReminders(schedule);
                }
            }
        }
    }

    private void sendReminders(Schedule schedule) {
        String agentEmail = schedule.getAgentEmail();
        String userEmail = schedule.getBookedByUserEmail();
        LocalTime startTime = schedule.getStartTime();

        // 1. Notify Agent
        if (agentEmail != null) {
            String message = "Reminder: You have an appointment with user " + userEmail + " at " + startTime;
            notificationRepo.save(new Notification(agentEmail, "Appointment Reminder", message, "INFO"));
            // Optional: Send email
            emailService.sendEmail(agentEmail, "Appointment Reminder", message);
        }

        // 2. Notify User
        if (userEmail != null) {
            String message = "Reminder: You have an upcoming appointment with Agent " + agentEmail + " at " + startTime;
            notificationRepo.save(new Notification(userEmail, "Appointment Reminder", message, "INFO"));
            // Optional: Send email
            emailService.sendEmail(userEmail, "Appointment Reminder", message);
        }

        // Mark as sent
        schedule.setReminderSent(true);
        scheduleRepo.save(schedule);

        System.out.println("Reminders sent for schedule ID: " + schedule.getId());
    }
}
