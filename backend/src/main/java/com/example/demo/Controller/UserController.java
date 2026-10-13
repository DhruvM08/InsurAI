package com.example.demo.Controller;

import com.example.demo.Object.*;
import com.example.demo.Service.AgentService;
import com.example.demo.Service.AuthService;
import com.example.demo.Service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Arrays; // Added for sample data
import java.util.Map; // Added for sample data
import com.example.demo.Repo.NotificationRepo;
import com.example.demo.Object.Notification;

@RestController
@RequestMapping("/InsureAi")
public class UserController {

    @Autowired
    private AuthService AuthService;

    @Autowired
    private AgentService agentService;

    @Autowired
    private PolicyService policyService;

    @Autowired
    private NotificationRepo notificationRepo;

    // 0:SignUp Endpoint ------------------
    @PostMapping("/singup")
    public String singupUser(@Validated @RequestBody SignupDTO user) {

        String result = AuthService.registerUser(user);
        return result;
    }

    // 1:SignIn Endpoint----------------------------
    @PostMapping("/singin")
    public ResponseEntity<?> getUser(@Validated @RequestBody LoginDTO loginDTO) {

        LoginResponse result = AuthService.loginUser(loginDTO);
        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // 2:Agent Schedule Endpoint --------------------------
    @PostMapping("/agentSchedule")
    public ResponseEntity<String> agentSchedule(@Validated @RequestBody Schedule schedule, @RequestParam String email) {
        String res = agentService.agentScheduling(schedule, email);
        return ResponseEntity.ok(res);
    }

    // 3:Fetch all Agent with Availabilities For User Dashboard-Booking Appointment
    // -------------------------
    @GetMapping("/agents/available")
    public ResponseEntity<List<AgentResponse>> getAllAgentsWithAvailability() {
        List<AgentResponse> agents = agentService.getAllAgentsWithAvailability();
        return ResponseEntity.ok(agents);
    }

    // 4.Book a schedule slot by User
    @PostMapping("/bookSchedule")
    public ResponseEntity<String> bookSchedule(@RequestBody BookRequest request) {
        String res = agentService.bookSchedule(
                request.agentEmail,
                request.scheduleId,
                request.userEmail,
                request.userNote,
                request.startTime,
                request.endTime,
                request.appointmentType);
        return ResponseEntity.ok(res);
    }

    // 5.Agent dashboard: show real booked requests for this agent
    @GetMapping("/agentRequests")
    public ResponseEntity<List<Schedule>> agentRequests(@RequestParam String email) {
        List<Schedule> res = agentService.getAgentBookedRequests(email);
        return ResponseEntity.ok(res);
    }

    // 6.Schedule Update Endpoint ----------------------
    @PostMapping("/updateScheduleStatus")
    public ResponseEntity<String> updateScheduleStatus(@RequestParam String email, @RequestParam String scheduleId,
            @RequestParam String status) {
        String res = agentService.updateScheduleStatus(email, scheduleId, status);
        return ResponseEntity.ok(res);
    }

    // 7.Apply for policies
    @PostMapping("/applyPolicy")
    public ResponseEntity<Policy> applyPolicy(@RequestBody PolicyRequest request) {
        Policy policy = policyService.applyForPolicy(request.userEmail, request.agentEmail, request.typeId,
                request.policyTypeName,
                request.formData);
        return ResponseEntity.ok(policy);
    }

    // 8:Fetch policy that associated With user
    @GetMapping("/myPolicies")
    public ResponseEntity<List<Policy>> getMyPolicies(@RequestParam String email) {
        return ResponseEntity.ok(policyService.getUserPolicies(email));
    }

    // 9:fetch all policies
    @GetMapping("/allPolicies")
    public ResponseEntity<List<Policy>> getAllPolicies(@RequestParam(required = false) String email) {
        if (email != null && !email.isEmpty()) {
            Optional<SignupDTO> userOpt = AuthService.getUserByEmail(email);
            if (userOpt.isPresent()) {
                SignupDTO user = userOpt.get();
                if ("Agent".equalsIgnoreCase(user.getRole())) {
                    // Filter specifically for this agent
                    return ResponseEntity.ok(policyService.getPoliciesByAgent(email));
                }
            }
        }
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    // 10:Update Policy with Status
    @PostMapping("/updatePolicy")
    public ResponseEntity<Policy> updatePolicy(@RequestBody UpdatePolicyRequest request) {
        Policy policy = policyService.updatePolicyStatus(request.policyId, request.status, request.comments);
        if (policy != null)
            return ResponseEntity.ok(policy);
        return ResponseEntity.badRequest().build();
    }

    // 11:Fetch All Users
    @GetMapping("/allUsers")
    public ResponseEntity<List<SignupDTO>> getAllUsers() {
        return ResponseEntity.ok(AuthService.getByRole("User"));
    }

    // 12:All Agents ---------------------------------
    @GetMapping("/allAgents")
    public ResponseEntity<List<AgentResponse>> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgentsWithAvailability());
    }

    // 13:All Schedule of Agent ----------------
    @GetMapping("/allSchedules")
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(agentService.getAllBookedSchedules());
    }

    // 14:Stats Tracking Realtime By repo Queries-------------------
    @GetMapping("/landing-stats")
    public ResponseEntity<java.util.Map<String, Object>> getLandingStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("users", AuthService.getByRole("User").size());
        stats.put("agents", AuthService.getByRole("Agent").size());
        stats.put("policies", policyOfferingService.getAllOfferings().size());
        stats.put("applications", policyService.getAllPolicies().size());
        return ResponseEntity.ok(stats);
    }


    @Autowired
    private com.example.demo.Service.PolicyOfferingService policyOfferingService;

    // 15: Create Policy Offering (Agent)
    @PostMapping("/createPolicyOffering")
    public ResponseEntity<String> createPolicyOffering(@RequestBody PolicyOffering offering,
            @RequestParam String agentEmail) {
        String res = policyOfferingService.createPolicyOffering(offering, agentEmail);
        return ResponseEntity.ok(res);
    }

    // 16: Get All Policy Offerings (User/Public)
    @GetMapping("/policyOfferings")
    public ResponseEntity<List<PolicyOffering>> getAllPolicyOfferings() {
        return ResponseEntity.ok(policyOfferingService.getAllOfferings());
    }

    // 17: Admin Notifications View
    @GetMapping("/admin/notifications")
    public ResponseEntity<List<Notification>> getAdminNotifications() {
        return ResponseEntity.ok(notificationRepo.findAll());
    }
}