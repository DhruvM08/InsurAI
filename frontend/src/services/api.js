import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/InsureAi';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});


api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const signup = async (userData) => {
  try {
    const payload = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    };
    if (userData.role === 'Agent') {
      if (userData.company != null) payload.company = userData.company;
      if (userData.specialization != null) payload.specialization = userData.specialization;
    }
    const response = await api.post('/singup', payload);


    const message = typeof response.data === 'string' ? response.data : response.data?.message || 'Registration Successful';


    const isSuccess = message.includes('Successful') || message.includes('successful');

    return {
      success: isSuccess,
      message: message
    };
  } catch (error) {
    let errorMessage = 'Signup failed. Please try again.';

    if (error.response) {

      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {

      errorMessage = 'Unable to connect to server. Please make sure the backend is running on port 9090.';
    } else {
      errorMessage = error.message || 'An unexpected error occurred';
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const signin = async (credentials) => {
  try {
    const response = await api.post('/singin', {
      email: credentials.email,
      password: credentials.password,
    });

    // Handle new JSON response format
    if (response.data && typeof response.data === 'object') {
      return {
        success: response.data.success,
        message: response.data.message,
        user: response.data.user
      };
    }

    // Fallback for legacy string response (if any)
    const message = typeof response.data === 'string' ? response.data : response.data?.message || 'Login Successful';
    const isSuccess = message.includes('Successful') || message.includes('successful');

    return {
      success: isSuccess,
      message: message
    };
  } catch (error) {
    let errorMessage = 'Signin failed. Please try again.';

    if (error.response) {
      // The backend now returns a JSON object on error too (400 Bad Request with LoginResponse body)
      if (error.response.data && typeof error.response.data === 'object' && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      errorMessage = 'Unable to connect to server. Please make sure the backend is running on port 9090.';
    } else {
      errorMessage = error.message || 'An unexpected error occurred';
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const agentScheduling = async (scheduleData, email) => {
  try {
    const response = await api.post(`/agentSchedule?email=${email}`, scheduleData);
    return {
      success: true,
      message: typeof response.data === 'string' ? response.data : 'Successfully scheduled'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Scheduling failed'
    };
  }
};

//Fetch the AgentAvailability from DB

export const fetchAgentsWithAvailability = async () => {
  try {
    const response = await api.get('/agents/available');
    return {
      success: true,
      agents: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      agents: [],
      message: error.response?.data || error.message || 'Failed to fetch agents'
    };
  }
};

//Update the Db as per changes
export const bookSchedule = async ({
  agentEmail,
  scheduleId,
  userEmail,
  userNote,
  startTime,
  endTime,
  appointmentType,
}) => {
  try {
    const response = await api.post('/bookSchedule', {
      agentEmail,
      scheduleId,
      userEmail,
      userNote,
      startTime,
      endTime,
      appointmentType,
    });

    return {
      success: true,
      message: typeof response.data === 'string' ? response.data : 'Slot booked successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to book slot'
    };
  }
};

export const updateScheduleStatus = async (email, scheduleId, status) => {
  try {
    const response = await api.post(`/updateScheduleStatus?email=${encodeURIComponent(email)}&scheduleId=${scheduleId}&status=${status}`);
    return {
      success: true,
      message: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to update status'
    };
  }
};

export const fetchAgentRequests = async (email) => {
  try {
    const response = await api.get(`/agentRequests?email=${encodeURIComponent(email)}`);
    return {
      success: true,
      requests: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      requests: [],
      message: error.response?.data || error.message || 'Failed to fetch agent requests'
    };
  }
};

export const applyForPolicy = async (userEmail, agentEmail, typeId, policyTypeName, formData) => {
  try {
    const response = await api.post('/applyPolicy', {
      userEmail,
      agentEmail,
      typeId,
      policyTypeName,
      formData
    });
    return {
      success: true,
      policy: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to apply for policy'
    };
  }
};

export const fetchMyPolicies = async (userEmail) => {
  try {
    const response = await api.get(`/myPolicies?email=${encodeURIComponent(userEmail)}`);
    return {
      success: true,
      policies: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      policies: [],
      message: error.response?.data || error.message || 'Failed to fetch policies'
    };
  }
};

export const fetchAllPolicies = async (email) => {
  try {
    const response = await api.get(`/allPolicies${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    return {
      success: true,
      policies: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      policies: [],
      message: error.response?.data || error.message || 'Failed to fetch policies'
    };
  }
};

export const updatePolicyStatus = async (policyId, status, comments) => {
  try {
    const response = await api.post('/updatePolicy', {
      policyId,
      status,
      comments
    });
    return {
      success: true,
      policy: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to update policy'
    };
  }
};

export const fetchAllAgents = async () => {
  try {
    const response = await api.get('/allAgents');
    return {
      success: true,
      agents: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      agents: [],
      message: error.response?.data || error.message || 'Failed to fetch agents'
    };
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/allUsers');
    return {
      success: true,
      users: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      users: [],
      message: error.response?.data || error.message || 'Failed to fetch users'
    };
  }
};

export const fetchSystemHealth = async () => {
  try {
    const response = await axios.get('http://localhost:9090/actuator/health');
    return {
      success: true,
      health: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch health'
    };
  }
};

export const fetchSystemMetrics = async (metricName) => {
  try {
    const url = `http://localhost:9090/actuator/metrics${metricName ? '/' + metricName : ''}`;
    const response = await axios.get(url);
    return {
      success: true,
      metrics: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch metrics'
    };
  }
};
export const fetchAllAppointments = async () => {
  try {
    const response = await api.get('/allSchedules');
    return {
      success: true,
      appointments: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      appointments: [],
      message: error.response?.data || error.message || 'Failed to fetch appointments'
    };
  }
};

export const createPolicyOffering = async (offeringData, agentEmail) => {
  try {
    const response = await api.post(`/createPolicyOffering?agentEmail=${encodeURIComponent(agentEmail)}`, offeringData);
    return {
      success: true,
      message: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to create policy offering'
    };
  }
};

export const getPolicyOfferings = async () => {
  try {
    const response = await api.get('/policyOfferings');
    return {
      success: true,
      offerings: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      offerings: [],
      message: error.response?.data || error.message || 'Failed to fetch policy offerings'
    };
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/feedback/submit', feedbackData);
    return {
      success: true,
      feedback: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to submit feedback'
    };
  }
};

export const fetchAgentFeedback = async (email) => {
  try {
    const response = await api.get(`/feedback/agent/${encodeURIComponent(email)}`);
    return {
      success: true,
      feedback: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      feedback: [],
      message: error.response?.data || error.message || 'Failed to fetch agent feedback'
    };
  }
};

export const fetchAllFeedback = async () => {
  try {
    const response = await api.get('/feedback/all');
    return {
      success: true,
      feedback: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      feedback: [],
      message: error.response?.data || error.message || 'Failed to fetch all feedback'
    };
  }
};

export const generateAIChatResponse = async (userMessage, history = [], userContext = {}) => {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  if (!GROQ_API_KEY) {
    console.error('Groq API Key is missing in .env file');
    return {
      success: false,
      message: "Chatbot configuration error. Please contact administrator."
    };
  }

  try {
    const { name, email, policies = [], appointments = [] } = userContext;

    const messages = [
      {
        role: "system",
        content: `You are the InsuAI Assistant, an intelligent support partner for the InsurAI platform. 
InsurAI is a modern insurance management platform bridging the gap between users, agents, and administrators.

Current User Context:
- Name: ${name || 'Valued User'}
- Email: ${email || 'Not provided'}
- Active Policies: ${policies.length > 0 ? policies.map(p => `${p.policyTypeName} (${p.status})`).join(', ') : 'No active policies'}
- Upcoming Appointments: ${appointments.length > 0 ? appointments.map(a => `${a.slot.startTime} with Agent ${a.agent.name}`).join(', ') : 'No upcoming appointments'}

Key Features of InsurAI:
- Users: Discover policies (Health, Life, Auto, etc.), apply for policies, book appointments with agents, and provide feedback.
- Agents: Manage availability, track requests, view client feedback, and create new policy offerings.
- Admins: Monitor system health, manage users/agents, and oversee policy applications globally.

Policy Offerings Knowledge:
- Health: Individual Star Health, Family Floater Plus, Senior Citizen Care.
- Life: Term Life Protection.
- Auto: Premium Auto Insurance.
- Specialized: Business Coverage (SME Protector).

General System Instructions:
- To book an appointment, users should go to the "Agents" section and select a time slot.
- To apply for a policy, users should browse "Policy Offerings" and click "Apply".
- To see their status, users can check "My Policies" or "Appointments" tabs.

Your Goal:
- Solve real-time queries regarding InsurAI.
- Provide personalized recommendations based on the user's current policies and appointments.
- Be professional, empathetic, and efficient.
- If a query is outside InsurAI's scope, politely redirect them back to insurance topics.
- Support email: insurai02@gmail.com

Tone: Professional, supportive, and efficient.`
      },
      ...history.slice(-10).map(msg => ({ // Send last 10 messages for context
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: "user", content: userMessage }
    ];

    const response = await axios.post(GROQ_API_URL, {
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    return {
      success: true,
      text: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('Groq API Error:', error);
    return {
      success: false,
      message: "I'm having trouble connecting to my brain right now. Please try again later or contact our support team at insurai02@gmail.com."
    };
  }
};

export default api;
