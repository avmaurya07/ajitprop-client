import axios from "axios";
import { logout } from "./auth";

/**
 * Setup axios interceptor to handle authentication errors globally
 * This will automatically logout and redirect when receiving 401 responses
 */
export const setupAxiosInterceptor = () => {
  // Response interceptor to catch authentication errors
  axios.interceptors.response.use(
    (response) => {
      // Return successful responses as-is
      return response;
    },
    (error) => {
      // Check if error is due to authentication failure
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        console.log("Authentication failed - logging out");
        logout();
      }

      // Reject the promise with the error for other cases
      return Promise.reject(error);
    },
  );
};
