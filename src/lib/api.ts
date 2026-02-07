const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      dateOfBirth?: string | null;
      address?: string | null;
      city?: string | null;
      state?: string | null;
      zipCode?: string | null;
      country?: string | null;
    };
    token: string;
  };
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  message: string;
  data: ProfileData;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface PrescriptionAnalysisRequest {
  rawText: string;
  uploadedImagePath?: string;
}

export interface MedicationSchedule {
  medicine: string;
  dosage: string;
  timing: string;
  instructions: string;
}

export interface HarmfulCombination {
  medicines: string[];
  risk: string;
  recommendation: string;
}

export interface OverdoseWarning {
  medicine: string;
  warning: string;
  max_daily_dose: string;
}

export interface SideEffect {
  medicine: string;
  effects: string[];
  action_required?: string;
}

export interface FoodInteraction {
  medicine: string;
  food_item: string;
  interaction: string;
  recommendation: string;
}

export interface LifestyleAdvice {
  medicine: string;
  advice: string;
  restrictions: string[];
}

export interface PrescriptionAnalysis {
  medication_schedule: MedicationSchedule[];
  harmful_combinations: HarmfulCombination[];
  overdose_warnings: OverdoseWarning[];
  side_effects: {
    common: SideEffect[];
    serious: SideEffect[];
  };
  food_interactions: FoodInteraction[];
  lifestyle_advice: LifestyleAdvice[];
  general_tips: string[];
}

export interface PrescriptionResponse {
  message: string;
  data: {
    id: string;
    rawText: string;
    uploadedImagePath: string | null;
    createdAt: string;
    analysis: PrescriptionAnalysis;
  };
}

export interface PrescriptionHistoryResponse {
  message: string;
  data: Array<{
    id: string;
    rawText: string;
    uploadedImagePath: string | null;
    createdAt: string;
    analysis: PrescriptionAnalysis | null;
  }>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Prescription endpoints
  async analyzePrescription(
    data: PrescriptionAnalysisRequest
  ): Promise<PrescriptionResponse> {
    return this.request<PrescriptionResponse>('/prescription/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPrescriptionHistory(): Promise<PrescriptionHistoryResponse> {
    return this.request<PrescriptionHistoryResponse>('/prescription/history');
  }

  // Profile endpoints
  async getProfile(): Promise<ProfileResponse> {
    return this.request<ProfileResponse>('/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
    return this.request<ProfileResponse>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Upload and analyze prescription image
  async uploadAndAnalyzePrescription(file: File): Promise<PrescriptionResponse> {
    const token = localStorage.getItem('auth_token');
    
    const formData = new FormData();
    formData.append('prescriptionImage', file);

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/prescription/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

