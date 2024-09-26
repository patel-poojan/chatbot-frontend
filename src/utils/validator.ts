const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const isEmailValid = (email: string) => {
  return emailRegex.test(email);
};

// Regex to validate password (minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const isPasswordValid = (password: string) => {
  return passwordRegex.test(password);
};
