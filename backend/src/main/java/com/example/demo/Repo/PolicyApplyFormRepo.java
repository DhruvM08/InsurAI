package com.example.demo.Repo;

import com.example.demo.Object.PolicyApplyForm;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyApplyFormRepo extends MongoRepository<PolicyApplyForm, String> {
}
