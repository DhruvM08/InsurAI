package com.example.demo.Object;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "notifications")
@Data
public class Notification {
    @Id
    private String id;

    private String userId; // Email or ID of the receiver
    private String title;
    private String message;
    private String type; // "INFO", "SUCCESS", "WARNING", "ERROR"

    private Instant createdAt;

    @JsonProperty("isRead")
    private boolean isRead;

    // Default Constructor
    public Notification() {
        this.createdAt = Instant.now();
        this.isRead = false;
    }

    // Custom Constructor
    public Notification(String userId, String title, String message, String type) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.createdAt = Instant.now();
        this.isRead = false;
    }
}