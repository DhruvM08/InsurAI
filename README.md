# 🏥 InsureAi - Modern Insurance Management Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**InsureAi** is a comprehensive, full-stack insurance management system designed to bridge the gap between users, agents, and administrators. Built with a modern tech stack, it provides a seamless experience for policy discovery, appointment scheduling, and feedback management.

---

## 🚀 Key Features

### 👤 User Features
- **Smart Policy Discovery**: Browse through various insurance offerings (Health, Life, Auto, etc.).
- **Easy Application**: Multi-step policy application process with real-time tracking.
- **Appointment Booking**: Book sessions with expert agents based on their availability.
- **Feedback System**: Rate your experience and provide feedback after appointments.
- **AI-Powered Assistant**: A built-in chatbot to help with policy inquiries and recommendations.

### 💼 Agent Features
- **Availability Management**: Set and update consultation schedules.
- **Request Tracking**: Manage incoming policy applications and appointment requests.
- **Client Feedback**: View ratings and reviews from users to improve service quality.
- **Policy Creation**: Design and offer new insurance products to the system.

### 🛠️ Admin Features
- **Central Dashboard**: bird's-eye view of all system activities.
- **User & Agent Management**: Oversee all registered users and agents in the system.
- **Policy Oversight**: Review and update the status of all policy applications globally.
- **System Health Monitoring**: Integrated Spring Boot Actuator for real-time health and metrics tracking.
- **Quality Review**: Monitor feedback across the platform to ensure high service standards.

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router 7, Axios, CSS3 |
| **Backend** | Java 21, Spring Boot 3.4.1, Spring Security |
| **Database** | MongoDB, H2 (Testing) |
| **DevOps/Monitoring** | Spring Boot Actuator, Maven |
| **Communication** | Spring Mail, RESTful APIs |

---

## 🛠️ Role-Based Functionality

| Role | Core Responsibilities |
| :--- | :--- |
| **Admin** | System Health Monitoring, User/Agent Management, Global Policy Tracking, Quality Review. |
| **Agent** | Creating Policy Offerings, Managing Appointments, Responding to Client Requests. |
| **User** | Policy Discovery, Appointment Booking, Real-time Application Tracking, AI Chat Help. |

---

## 📁 Project Structure

```text
InsureAi/
├── backend/                # Spring Boot Application
│   ├── src/main/java/      # Java Source Code
│   ├── src/main/resources/ # Configurations (application.properties)
│   └── pom.xml             # Maven Dependencies
├── frontend/               # React Application
│   ├── src/                # React Source Code
│   │   ├── components/     # UI Components (User, Agent, Admin)
│   │   ├── services/       # API Integration (Axios)
│   │   └── App.jsx         # Routing Logic
│   └── package.json        # Node.js Dependencies
└── README.md               # Project Documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- **Java**: JDK 21
- **Node.js**: v16 or higher
- **MongoDB**: Local instance or MongoDB Atlas URI

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure `application.properties` with your MongoDB URI.
3. Build and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will start at `http://localhost:9090`.

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or the port specified by Vite).

---

## 🤖 AI Assistant (Static QA)
The platform features an intelligent assistant capable of answering common questions about:
- General policy inquiries
- Required documents
- Health insurance specifics
- Corporate plans
- Personalized recommendations

---

## 📜 License
Available under the MIT License. See the [LICENSE](LICENSE) file for more info.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---
*Developed with ❤️ by the InsureAi Team.*
