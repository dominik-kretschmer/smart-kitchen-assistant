export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export interface credentialsRegister {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface credentialsLogin {
  username: string;
  password: string;
}
