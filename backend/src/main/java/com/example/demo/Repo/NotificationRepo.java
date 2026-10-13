package com.example.demo.Repo;

import com.example.demo.Object.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepo extends MongoRepository<Notification, String> {
        List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
}