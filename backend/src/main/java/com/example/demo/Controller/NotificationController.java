package com.example.demo.Controller;

import com.example.demo.Object.Notification;
import com.example.demo.Repo.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/InsureAi/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepo notificationRepo;

    // 1. GET: Fetch notifications
    @GetMapping("/{userId:.+}")
    public List<Notification> getUserNotifications(@PathVariable String userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // 2. PUT: Mark as Read
    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable String id) {
        Notification n = notificationRepo.findById(id).orElse(null);

        if (n != null) {
            n.setRead(true);
            notificationRepo.save(n);
        }
    }

    // 3. DELETE: Remove notification
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable String id) {
        notificationRepo.deleteById(id);
    }
}