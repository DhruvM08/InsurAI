package com.example.demo.ai.tools;

import com.example.demo.Object.Policy;
import com.example.demo.Object.Schedule;
import com.example.demo.Object.SignupDTO;
import com.example.demo.Repo.PolicyRepo;
import com.example.demo.Repo.ScheduleRepo;
import com.example.demo.Repo.UserDTOREPO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class InsurancePolicyTools {

    private static final Logger logger = LoggerFactory.getLogger(InsurancePolicyTools.class);

    private final PolicyRepo policyRepo;
    private final ScheduleRepo scheduleRepo;
    private final UserDTOREPO userRepo;

    public InsurancePolicyTools(PolicyRepo policyRepo, ScheduleRepo scheduleRepo, UserDTOREPO userRepo) {
        this.policyRepo = policyRepo;
        this.scheduleRepo = scheduleRepo;
        this.userRepo = userRepo;
    }

    @Tool(description = "Check the live status and details of insurance policies for a specific user email")
    public String checkUserPolicyStatus(
            @ToolParam(description = "The registered email address of the policyholder") String userEmail,
            @ToolParam(description = "Optional policy type filter, e.g. Health, Life, Auto") String policyType
    ) {
        logger.info("Executing Tool: checkUserPolicyStatus for email: {}, type: {}", userEmail, policyType);
        try {
            if (userEmail == null || userEmail.isBlank()) {
                return "Error: User email is required to retrieve policy records.";
            }

            List<Policy> policies = policyRepo.findByUserEmail(userEmail.trim());
            if (policies == null || policies.isEmpty()) {
                return "No policy applications or active coverage found for account: " + userEmail;
            }

            StringBuilder sb = new StringBuilder("Found " + policies.size() + " policy record(s) for " + userEmail + ":\n");
            for (Policy p : policies) {
                if (policyType != null && !policyType.isBlank() &&
                        !p.getPolicyTypeName().toLowerCase().contains(policyType.toLowerCase())) {
                    continue;
                }
                sb.append(String.format(Locale.US,
                        "- Policy ID: %s | Type: %s | Status: %s | Agent Assigned: %s | Comments: %s\n",
                        p.getId() != null ? p.getId() : "N/A",
                        p.getPolicyTypeName() != null ? p.getPolicyTypeName() : "Standard",
                        p.getStatus() != null ? p.getStatus() : "Pending",
                        p.getAgentEmail() != null ? p.getAgentEmail() : "Unassigned",
                        p.getAgentComments() != null ? p.getAgentComments() : "None"
                ));
            }
            return sb.toString();

        } catch (Exception e) {
            logger.error("Error executing checkUserPolicyStatus tool: {}", e.getMessage(), e);
            return "Unable to retrieve policy status from database due to technical error: " + e.getMessage();
        }
    }

    @Tool(description = "Find certified insurance agents and their consultation availability based on specialization")
    public String findAvailableAgents(
            @ToolParam(description = "Specialization area, e.g. Health, Life, Auto, Business") String specialization
    ) {
        logger.info("Executing Tool: findAvailableAgents for specialization: {}", specialization);
        try {
            List<SignupDTO> allAgents = userRepo.findByRole("Agent");
            if (allAgents == null || allAgents.isEmpty()) {
                return "No agents are currently registered on the platform.";
            }

            StringBuilder sb = new StringBuilder("Available Certified InsurAI Agents:\n");
            int matchCount = 0;

            for (SignupDTO agent : allAgents) {
                boolean matchesSpec = specialization == null || specialization.isBlank()
                        || (agent.getSpecialization() != null && agent.getSpecialization().toLowerCase().contains(specialization.toLowerCase()))
                        || (agent.getCompany() != null && agent.getCompany().toLowerCase().contains(specialization.toLowerCase()));

                if (matchesSpec) {
                    matchCount++;
                    sb.append(String.format(Locale.US,
                            "- %s (%s) | Email: %s | Company: %s\n",
                            agent.getName() != null ? agent.getName() : "Agent",
                            agent.getSpecialization() != null ? agent.getSpecialization() : "General Insurance",
                            agent.getEmail(),
                            agent.getCompany() != null ? agent.getCompany() : "InsurAI Partner"
                    ));

                    // Check upcoming schedule slots
                    List<Schedule> schedules = scheduleRepo.findByAgentEmail(agent.getEmail());
                    if (schedules != null && !schedules.isEmpty()) {
                        sb.append("  Upcoming Open Days: ");
                        for (int i = 0; i < Math.min(3, schedules.size()); i++) {
                            Schedule s = schedules.get(i);
                            sb.append(s.getDate() != null ? s.getDate().toString() : "Available").append(" ");
                        }
                        sb.append("\n");
                    }
                }
            }

            if (matchCount == 0) {
                return "No agents currently specialize in '" + specialization + "'. Displaying general insurance agents instead:\n" +
                        findAvailableAgents("");
            }

            sb.append("\nTip: Users can book an appointment directly from the 'Agents' tab in their dashboard.");
            return sb.toString();

        } catch (Exception e) {
            logger.error("Error executing findAvailableAgents tool: {}", e.getMessage(), e);
            return "Unable to query agent availability at this moment: " + e.getMessage();
        }
    }

    @Tool(description = "Calculate instant actuarial premium quotes and cost estimates based on coverage amount, age, and risk factors")
    public String calculatePremiumQuote(
            @ToolParam(description = "Type of insurance: Health, Life, Auto, or SME") String policyType,
            @ToolParam(description = "Desired total coverage / sum assured in USD (e.g. 500000)") double coverageAmount,
            @ToolParam(description = "Age of the primary insured in years") int age,
            @ToolParam(description = "Whether the applicant uses tobacco / smokes (true/false)") boolean isSmoker,
            @ToolParam(description = "Whether the applicant has existing chronic medical conditions (true/false)") boolean hasPreExistingConditions
    ) {
        logger.info("Executing Tool: calculatePremiumQuote for type: {}, coverage: {}, age: {}, smoker: {}, ped: {}",
                policyType, coverageAmount, age, isSmoker, hasPreExistingConditions);

        if (coverageAmount <= 0) {
            return "Error: Coverage amount must be greater than 0.";
        }
        if (age < 18 || age > 99) {
            return "Error: Insured age must be between 18 and 99 years.";
        }

        String typeClean = policyType != null ? policyType.trim().toLowerCase() : "health";
        double baseRatePerThousand;
        double ageMultiplier = 1.0;

        // Actuarial Age Band Multipliers
        if (age < 30) {
            ageMultiplier = 0.85;
        } else if (age < 45) {
            ageMultiplier = 1.15;
        } else if (age < 60) {
            ageMultiplier = 1.65;
        } else {
            ageMultiplier = 2.40;
        }

        // Policy Type Base Rates
        switch (typeClean) {
            case "life":
            case "term life":
                baseRatePerThousand = 1.20; // $1.20 per $1,000 sum assured
                break;
            case "auto":
            case "motor":
                baseRatePerThousand = 22.00; // auto vehicle valuation based
                break;
            case "sme":
            case "business":
                baseRatePerThousand = 15.00; // commercial asset rate
                break;
            case "health":
            default:
                baseRatePerThousand = 4.80; // health coverage rate
                break;
        }

        double annualBase = (coverageAmount / 1000.0) * baseRatePerThousand * ageMultiplier;

        // Risk loading
        double riskLoadingFactor = 1.0;
        StringBuilder riskNotes = new StringBuilder();

        if (isSmoker) {
            riskLoadingFactor += 0.40; // 40% loading for smoker
            riskNotes.append("Tobacco usage (+40% risk factor); ");
        }
        if (hasPreExistingConditions) {
            riskLoadingFactor += 0.25; // 25% loading for pre-existing disease
            riskNotes.append("Declared pre-existing conditions (+25% risk factor); ");
        }

        double finalAnnualPremium = annualBase * riskLoadingFactor;
        double finalMonthlyPremium = finalAnnualPremium / 12.0;

        return String.format(Locale.US,
                """
                === Official InsurAI Actuarial Premium Estimate ===
                Policy Category: %s
                Coverage Amount (Sum Assured): $%,.2f
                Applicant Age: %d years
                Risk Factors Applied: %s
                -------------------------------------------------
                Estimated Monthly Premium: $%,.2f / month
                Estimated Annual Premium:  $%,.2f / year
                (Inclusive of state insurance regulatory fees & emergency roadside / cashless network guarantee)
                Note: Final premium is subject to medical underwriting and document verification during agent consultation.
                """,
                policyType.toUpperCase(),
                coverageAmount,
                age,
                riskNotes.length() > 0 ? riskNotes.toString() : "Standard Preferred (No risk loading)",
                finalMonthlyPremium,
                finalAnnualPremium
        );
    }
}
