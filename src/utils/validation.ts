export const validateStudentEmail = (email: string): boolean => {
  // Student emails: 6 digits followed by @crescent.education
  const studentPattern = /^\d{6}@crescent\.education$/;
  return studentPattern.test(email);
};

export const validateAdminEmail = (email: string): boolean => {
  // Admin emails: letters (and possibly dots/hyphens) followed by @crescent.education
  const adminPattern = /^[a-zA-Z][a-zA-Z0-9.-]*[a-zA-Z]@crescent\.education$/;
  return adminPattern.test(email);
};

export const validateEmail = (email: string): { isValid: boolean; role?: 'student' | 'admin'; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (validateStudentEmail(email)) {
    return { isValid: true, role: 'student' };
  }

  if (validateAdminEmail(email)) {
    return { isValid: true, role: 'admin' };
  }

  return { 
    isValid: false, 
    error: 'Invalid email format. Students: 6 digits@crescent.education, Admins: name@crescent.education' 
  };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
  }

  return { isValid: true };
};