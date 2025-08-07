import type { ValidationResult } from '../types/validationTypes';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function useValidation() {
  const validateRequired = (value: unknown, fieldName: string): ValidationResult => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return {
        isValid: false,
        errorMessage: `${fieldName} is required`,
      };
    }
    return { isValid: true, errorMessage: '' };
  };

  const validateMinLength = (
    value: string,
    minLength: number,
    fieldName: string,
  ): ValidationResult => {
    if (value.length < minLength) {
      return {
        isValid: false,
        errorMessage: `${fieldName} must be at least ${minLength} characters long`,
      };
    }
    return { isValid: true, errorMessage: '' };
  };

  const validateMaxLength = (
    value: string,
    maxLength: number,
    fieldName: string,
  ): ValidationResult => {
    if (value.length > maxLength) {
      return {
        isValid: false,
        errorMessage: `${fieldName} must not exceed ${maxLength} characters`,
      };
    }
    return { isValid: true, errorMessage: '' };
  };

  const validateEmail = (email: string): ValidationResult => {
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        errorMessage: 'Please enter a valid email address',
      };
    }
    return { isValid: true, errorMessage: '' };
  };

  const validateNumber = (value: unknown): ValidationResult => {
    if (typeof value !== 'number' && isNaN(Number(value))) {
      return {
        isValid: false,
        errorMessage: 'Please enter a valid number',
      };
    }
    return { isValid: true, errorMessage: '' };
  };

  const validatePositiveNumber = (value: number): ValidationResult => {
    if (value <= 0) {
      return {
        isValid: false,
        errorMessage: 'Please enter a positive number',
      };
    }
    return { isValid: true, errorMessage: '' };
  };

  const validateUsername = (username: string): ValidationResult => {
    const requiredCheck = validateRequired(username, 'Username');
    if (!requiredCheck.isValid) return requiredCheck;

    const minLengthCheck = validateMinLength(username, 3, 'Username');
    if (!minLengthCheck.isValid) return minLengthCheck;

    const maxLengthCheck = validateMaxLength(username, 20, 'Username');
    if (!maxLengthCheck.isValid) return maxLengthCheck;

    return { isValid: true, errorMessage: '' };
  };

  const validatePassword = (password: string): ValidationResult => {
    const requiredCheck = validateRequired(password, 'Password');
    if (!requiredCheck.isValid) return requiredCheck;

    const minLengthCheck = validateMinLength(password, 6, 'Password');
    if (!minLengthCheck.isValid) return minLengthCheck;

    return { isValid: true, errorMessage: '' };
  };

  const validatePasswordsMatch = (password: string, confirmPassword: string): ValidationResult => {
    if (password !== confirmPassword) {
      return {
        isValid: false,
        errorMessage: 'Passwords do not match',
      };
    }
    return { isValid: true, errorMessage: '' };
  };

  const validateLoginForm = (credentials: {
    username: string;
    password: string;
  }): ValidationResult => {
    const usernameCheck = validateUsername(credentials.username);
    if (!usernameCheck.isValid) return usernameCheck;

    const passwordCheck = validatePassword(credentials.password);
    if (!passwordCheck.isValid) return passwordCheck;

    return { isValid: true, errorMessage: '' };
  };

  const validateRegisterForm = (credentials: {
    username: string;
    password: string;
    confirmPassword: string;
  }): ValidationResult => {
    const usernameCheck = validateUsername(credentials.username);
    if (!usernameCheck.isValid) return usernameCheck;

    const passwordCheck = validatePassword(credentials.password);
    if (!passwordCheck.isValid) return passwordCheck;

    const confirmPasswordCheck = validateRequired(credentials.confirmPassword, 'Confirm Password');
    if (!confirmPasswordCheck.isValid) return confirmPasswordCheck;

    const passwordsMatchCheck = validatePasswordsMatch(
      credentials.password,
      credentials.confirmPassword,
    );
    if (!passwordsMatchCheck.isValid) return passwordsMatchCheck;

    return { isValid: true, errorMessage: '' };
  };

  const validateStockItem = (item: {
    name: string;
    quantity: number;
    unit: string;
  }): ValidationResult => {
    const nameCheck = validateRequired(item.name, 'Item name');
    if (!nameCheck.isValid) return nameCheck;

    const quantityCheck = validateNumber(item.quantity);
    if (!quantityCheck.isValid) return quantityCheck;

    const positiveCheck = validatePositiveNumber(item.quantity);
    if (!positiveCheck.isValid) return positiveCheck;

    const unitCheck = validateRequired(item.unit, 'Unit');
    if (!unitCheck.isValid) return unitCheck;
    return { isValid: true, errorMessage: '' };
  };

  return {
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validateEmail,
    validateNumber,
    validatePositiveNumber,
    validateUsername,
    validatePassword,
    validatePasswordsMatch,
    validateLoginForm,
    validateRegisterForm,
    validateStockItem,
  };
}
