package com.example.demo.Service;

import com.example.demo.Object.Feedback;
import com.example.demo.Object.Notification;
import com.example.demo.Repo.FeedbackRepo;
import com.example.demo.Repo.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepo feedbackRepo;

    @Autowired
    private NotificationRepo notificationRepo;

    public Feedback submitFeedback(Feedback feedback) {
        Feedback saved = feedbackRepo.save(feedback);

        // Notify Agent about new feedback
        notificationRepo.save(new Notification(feedback.getAgentEmail(),
                "New Appointment Feedback",
                "A user gave you a " + feedback.getRating() + " star rating.",
                "SUCCESS"));

        return saved;
    }

    public List<Feedback> getAgentFeedback(String agentEmail) {
        return feedbackRepo.findByAgentEmail(agentEmail);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepo.findAll();
    }
}
