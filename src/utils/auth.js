/**
 * Utility functions for authentication and token management
 */

/**
 * Decode JWT token without verification (client-side only)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;

    // JWT has 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired, false otherwise
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);

    if (!decoded || !decoded.exp) {
      return true;
    }

    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Clear authentication data from localStorage and redirect to login
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

/**
 * Check if user is authenticated with a valid token
 * @returns {boolean} - True if authenticated with valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    // Token is expired, clean up and return false
    logout();
    return false;
  }

  return true;
};
