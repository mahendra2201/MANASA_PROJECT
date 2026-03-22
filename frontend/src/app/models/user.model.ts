export interface User {
  id:        number;
  full_name: string;
  email:     string;
  role:      'marketing_team' | 'content_creator' | 'executive' | 'it_support' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token:   string;
  user:    User;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email:     string;
  password:  string;
  role:      string;
}
