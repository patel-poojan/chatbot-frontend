interface SuccessResponse {
  success: true;
  result: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type Base64Response = SuccessResponse | ErrorResponse;

export const decryptFromBase64 = (base64Str: string): Base64Response => {
  try {
    const decoded = atob(base64Str);
    return {
      success: true,
      result: decoded,
    };
  } catch (error) {
    return {
      success: false,
      error: `Decryption failed: ${(error as Error).message}`,
    };
  }
};
// Function to encrypt a string to Base64
export const encryptToBase64 = (str: string): Base64Response => {
  try {
    // Convert the string to Base64
    const encoded = btoa(str);
    return {
      success: true,
      result: encoded,
    };
  } catch (error) {
    return {
      success: false,
      error: `Encryption failed: ${(error as Error).message}`,
    };
  }
};

export const dummy = (str: string | undefined) => {
  if (str) {
    return str;
  } else {
    return '';
  }
};
