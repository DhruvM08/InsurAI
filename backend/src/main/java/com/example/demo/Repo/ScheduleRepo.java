package com.example.demo.Repo;

import com.example.demo.Object.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepo extends MongoRepository<Schedule, String> {
    List<Schedule> findByAgentEmail(String agentEmail);

    List<Schedule> findAllByDate(java.time.LocalDate date);
}
