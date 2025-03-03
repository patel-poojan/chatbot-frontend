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

const urlRegex =
  /^(((http|https):\/\/|)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?)$/;

// Combined function that returns true only when URL is both valid and active
export const isValidUrl = async (url: string): Promise<boolean> => {
  // Check if format is valid
  const isValid = urlRegex.test(url);

  // If not valid, return false immediately
  if (!isValid) {
    return false;
  }

  // Add protocol if missing
  const urlToCheck = url.startsWith('http') ? url : `https://${url}`;

  try {
    // Attempt to fetch the URL
    await fetch(urlToCheck, {
      method: 'HEAD', // Use HEAD to avoid downloading full content
      mode: 'no-cors', // For client-side browser environment
    });
    // Return true only if URL is both valid and active
    return true;
  } catch (error) {
    // Any error means URL is not active
    return false;
  }
};
