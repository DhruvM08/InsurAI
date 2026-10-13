package com.example.demo.Repo;

import com.example.demo.Object.SignupDTO;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserDTOREPO extends MongoRepository<SignupDTO, Object> {

    // here MongoRepo use auto Query Execution to check the Existence of the Data to
    // remove Duplicates

    //Check Email (Exist or not)
    boolean existsByEmail(String email);

    //Fetch by Email
    Optional<SignupDTO> findByEmail(String email);

    //Fetch By Role
    List<SignupDTO> findByRole(String role);
}