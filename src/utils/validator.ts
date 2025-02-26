const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const isEmailValid = (email: string) => {
  return emailRegex.test(email);
};
const enhancedPhoneRegex = /^\+?[1-9][\d\s-()]{5,19}$/;

export const isPhoneValid = (phone: string) => {
  // Normalize by removing all non-numeric characters except the leading +
  const normalizedPhone = phone.replace(/(?!^\+)\D/g, '');
  return (
    enhancedPhoneRegex.test(phone) &&
    normalizedPhone.length >= 7 &&
    normalizedPhone.length <= 15
  );
};

// Regex to validate password (minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const isPasswordValid = (password: string) => {
  return passwordRegex.test(password);
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
