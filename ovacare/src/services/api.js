const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Auth Services
export const login = async (data) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Invalid credentials");
  const result = await response.json();
  if (result.access_token) {
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }
  return result;
};

export const signup = async (data) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Signup backend error:", result);

    const message = Array.isArray(result.detail)
      ? result.detail.map((e) => `${e.loc?.join(".")}: ${e.msg}`).join(" | ")
      : result.detail || "Signup failed";

    throw new Error(message);
  }
  if (result.access_token) {
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }
  return result;
};

export const getMe = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Not authenticated");
  return response.json();
};

export const setupDoctorProfile = async (data) => {
  const response = await fetch(`${API_URL}/auth/setup-doctor-profile`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to setup doctor profile");
  return response.json();
};

export const setupPatientProfile = async (data) => {
  const response = await fetch(`${API_URL}/auth/setup-patient-profile`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to setup patient profile");
  return response.json();
};

export const getCurrentDoctor = async () => {
  const response = await fetch(`${API_URL}/auth/me/doctor`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Doctor profile not found");
  return response.json();
};

export const getCurrentPatient = async () => {
  const response = await fetch(`${API_URL}/auth/me/patient`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Patient profile not found");
  return response.json();
};

// Patient Services
export const getPatients = async () => {
  const response = await fetch(`${API_URL}/patients/`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Failed to fetch patients");
  return response.json();
};

export const getPatientById = async (id) => {
  const response = await fetch(`${API_URL}/patients/${id}`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Failed to fetch patient details");
  return response.json();
};

export const getDoctors = async () => {
  const response = await fetch(`${API_URL}/doctors/`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Failed to fetch doctors");
  return response.json();
};

export const getDoctorById = async (id) => {
  const response = await fetch(`${API_URL}/doctors/${id}`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Failed to fetch doctor details");
  return response.json();
};

export const getDoctorPatients = async () => {
  const response = await fetch(`${API_URL}/doctors/me/patients`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Failed to fetch doctor patients");
  return response.json();
};

export const createPatient = async (data) => {
  const response = await fetch(`${API_URL}/patients/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create patient");
  return response.json();
};

export const updatePatient = async (id, data) => {
  const response = await fetch(`${API_URL}/patients/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update patient");
  return response.json();
};

export const deletePatient = async (id) => {
  const response = await fetch(`${API_URL}/patients/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete patient");
  return response.status === 204 ? null : response.json();
};

export const uploadLabTestForOCR = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/ocr/lab-test`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to process lab test OCR");
  return response.json();
};

export const uploadUltrasoundImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/uploads/ultrasound`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload ultrasound image");
  return response.json();
};

export const saveLabTestFromRiskPage = async (data) => {
  const response = await fetch(`${API_URL}/lab-tests/from-risk-page`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to save lab test");
  return response.json();
};

export const saveUltrasoundFromRiskPage = async (data) => {
  const response = await fetch(`${API_URL}/ultrasounds/from-risk-page`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to save ultrasound record");
  return response.json();
};

export const getPatientFullDetails = async (patientId) => {
  const response = await fetch(`${API_URL}/patients/${patientId}/full-details`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch patient full details");
  return response.json();
};

export const getTreatmentInputs = async (patientId) => {
  const response = await fetch(`${API_URL}/patients/${patientId}/treatment-inputs`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch treatment inputs");
  return response.json();
};

export const saveTreatmentResponseRun = async (data) => {
  const response = await fetch(`${API_URL}/model-runs/treatment-response`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to save treatment response run");
  return response.json();
};

export const uploadFaceImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/uploads/face-image`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload face image");
  return response.json();
};

export const analyzeAcne = async (data) => {
  const response = await fetch(`${API_URL}/acne/analyze`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to analyze acne");
  return response.json();
};

export const getAcneHistory = async () => {
  const response = await fetch(`${API_URL}/acne/history`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch acne history");
  return response.json();
};

export const getLatestAcneAnalysis = async () => {
  const response = await fetch(`${API_URL}/acne/latest`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch latest acne analysis");
  return response.json();
};

// PCOS AI Services
export const segmentUltrasound = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/pcos/segment`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Ultrasound segmentation failed");
  return response.json();
};

export const saveSegmentation = async (data) => {
  const response = await fetch(`${API_URL}/pcos/save-segmentation`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to save segmentation results");
  return response.json();
};

export const predictFullPCOS = async (data) => {
  const response = await fetch(`${API_URL}/pcos/predict-full`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  if (!response.ok) {
    const errorMsg = result.detail || "Full PCOS prediction failed";
    throw new Error(errorMsg);
  }
  return result;
};

// Integrated Assistant Services
export const predictAcneIntegrated = async (imageB64) => {
  const response = await fetch(`${API_URL}/predict/acne`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ image_b64: imageB64 }),
  });
  if (!response.ok) throw new Error('Integrated Acne prediction failed');
  return response.json();
};

export const predictPCOSIntegrated = async (symptomData) => {
  const response = await fetch(`${API_URL}/predict/pcos`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ symptom_data: symptomData }),
  });
  if (!response.ok) throw new Error('Integrated PCOS prediction failed');
  return response.json();
};

export const predictProgressionIntegrated = async (symptomData, days = 30) => {
  const response = await fetch(`${API_URL}/predict/progression`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ symptom_data: symptomData, days }),
  });
  if (!response.ok) throw new Error('Integrated Progression prediction failed');
  return response.json();
};

export const chatWithAssistant = async (message, imageB64 = null) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message, image_b64: imageB64 }),
  });
  if (!response.ok) throw new Error('Assistant chat failed');
  return response.json();
};
