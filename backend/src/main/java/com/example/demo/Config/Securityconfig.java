package com.example.demo.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class Securityconfig {

    // Spring Security Config For the Security of Endpoints of Website
    // ---------------------------
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .csrf(csrf -> csrf.disable()) // disable CSRF for POST requests (especially for Postman)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/InsureAi/singup",
                                "/InsureAi/singin",
                                "/InsureAi/agentSchedule/**",
                                "/InsureAi/agents/**",
                                "/InsureAi/agentRequests",
                                "/InsureAi/agentRequests/**",
                                "/InsureAi/bookSchedule",
                                "/InsureAi/bookSchedule/**",
                                "/InsureAi/applyPolicy/**",
                                "/InsureAi/myPolicies/**",
                                "/InsureAi/allPolicies/**",
                                "/InsureAi/updatePolicy/**",
                                "/InsureAi/updateScheduleStatus",
                                "/InsureAi/allUsers/**",
                                "/InsureAi/allAgents/**",
                                "/InsureAi/landing-stats/**",
                                "/InsureAi/forgot-password/**",
                                "/InsureAi/reset-password/**",
                                "/actuator/**",
                                "/InsureAi/allSchedules/**",
                                "/InsureAi/agent/notifications/**",
                                "/InsureAi/admin/notifications",
                                "/InsureAi/admin/notifications/**",
                                "/InsureAi/agent/feedback/**",
                                "/InsureAi/notifications/**",
                                "/InsureAi/feedback/**",
                                "/api/notifications/**",
                                "/InsureAi/createPolicyOffering",
                                "/InsureAi/policyOfferings")
                        .permitAll()// allow these

                        .anyRequest().authenticated());

        return http.build();
    }

    // Config For stop a Blocking Frontend Endpoint by Spring security Called
    // CORSConfig
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173")); // React dev
                                                                                                          // server
                                                                                                          // ports
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Initialize Bean For Inject BcryptEncoding Technique in Service layer
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
