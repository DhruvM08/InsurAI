package com.example.demo.Repo;

import com.example.demo.Object.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeedbackRepo extends MongoRepository<Feedback, String> {
    List<Feedback> findByAgentEmail(String agentEmail);

    List<Feedback> findByAppointmentId(String appointmentId);
}
