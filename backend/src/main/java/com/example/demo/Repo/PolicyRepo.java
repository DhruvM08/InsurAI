package com.example.demo.Repo;

import com.example.demo.Object.Policy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepo extends MongoRepository<Policy, String> {
    List<Policy> findByUserEmail(String userEmail);

    List<Policy> findByStatus(String status);

    List<Policy> findByPolicyTypeNameStartingWithIgnoreCase(String specialization);

    List<Policy> findByAgentEmail(String agentEmail);
}
