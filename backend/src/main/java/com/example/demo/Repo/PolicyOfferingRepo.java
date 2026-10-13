package com.example.demo.Repo;

import com.example.demo.Object.PolicyOffering;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyOfferingRepo extends MongoRepository<PolicyOffering, String> {
    List<PolicyOffering> findByAgentEmail(String agentEmail);

    List<PolicyOffering> findByType(String type);
}
