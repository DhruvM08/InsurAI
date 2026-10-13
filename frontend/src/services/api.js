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
  try {
    const { name, email } = userContext || {};

    const formattedHistory = (history || [])
      .filter(msg => msg.text)
      .slice(-10)
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    const response = await api.post('/ai/chat', {
      message: userMessage,
      userEmail: email,
      userName: name,
      history: formattedHistory
    });

    if (response.data && response.data.success) {
      return {
        success: true,
        text: response.data.reply
      };
    } else {
      return {
        success: false,
        message: response.data?.reply || "Failed to generate AI response."
      };
    }
  } catch (error) {
    console.error('Spring AI Backend Error:', error);
    return {
      success: false,
      message: error.response?.data?.reply || error.message || "I'm having trouble connecting to my advisory engine. Please try again later or contact our support team at insurai02@gmail.com."
    };
  }
};

export default api;
