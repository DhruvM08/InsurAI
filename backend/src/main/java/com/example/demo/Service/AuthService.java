package com.example.demo.Service;

import com.example.demo.Object.LoginDTO;
import com.example.demo.Object.LoginResponse;

import com.example.demo.Object.SignupDTO;
import com.example.demo.Repo.UserDTOREPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserDTOREPO userDTOREPO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${mail.password}")
    String adminpassword;

    @Value("${mail.username}")
    String adminEmail;

    // Admin Panel Post Request --------------------------------------
    @jakarta.annotation.PostConstruct
    public void seedAdmin() {
        try {
            if (!userDTOREPO.existsByEmail(adminEmail)) {
                SignupDTO admin = new SignupDTO();
                admin.setName("System Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminpassword));
                admin.setRole("Admin");
                userDTOREPO.save(admin);
                System.out.println("Admin added successfully.");
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not seed admin user on startup (database unreachable): " + e.getMessage());
        }
    }

    public String registerUser(SignupDTO singup) {

        SignupDTO signupDTO = new SignupDTO();

        if (userDTOREPO.existsByEmail(singup.getEmail())) {
            return "User is already Register !!!";
        }

        if (!singup.getPassword().equals(singup.getConfirmPassword())) {
            return "Password Do Not Match";
        }

        if ("Agent".equals(singup.getRole())) {
            if (singup.getCompany() == null || singup.getCompany().trim().isEmpty()) {
                return "Company is required for Agent";
            }
            if (singup.getSpecialization() == null || singup.getSpecialization().trim().isEmpty()) {
                return "Specialization is required for Agent";
            }
        }

        signupDTO.setName(singup.getName().trim());
        signupDTO.setEmail(singup.getEmail().trim());
        signupDTO.setPassword(passwordEncoder.encode(singup.getPassword()));
        signupDTO.setRole(singup.getRole());
        if (signupDTO.getRole().equals("Agent")) {
            signupDTO.setAgentSchedule(new ArrayList<>());
            signupDTO.setCompany(singup.getCompany().trim());
            signupDTO.setSpecialization(singup.getSpecialization().trim());
        }
        userDTOREPO.save(signupDTO);
        return "Registration Successful";
    }

    public LoginResponse loginUser(LoginDTO loginDTO) {

        // here Password in Hashed Form So you cannot directly use
        // existPasswordandMail() method to find user because user entered pass and
        // database pass in diff form
        Optional<SignupDTO> user = userDTOREPO.findByEmail(loginDTO.getEmail());

        if (user.isEmpty()) {
            return new LoginResponse(false, "User does not exist", null);
        }

        SignupDTO signupDTO = user.get();

        // Use matches instead of equals due to every time generated hash is not Equal
        // for same pass due to Bcrypt so here use password Encoder
        if (passwordEncoder.matches(loginDTO.getPassword(), signupDTO.getPassword())) {
            return new LoginResponse(true, "Login Successful", signupDTO);
        } else {
            return new LoginResponse(false, "Wrong Password", null);
        }
    }

    public java.util.List<SignupDTO> getByRole(String role) {
        return userDTOREPO.findByRole(role);
    }

    public Optional<SignupDTO> getUserByEmail(String email) {
        return userDTOREPO.findByEmail(email);
    }
}
