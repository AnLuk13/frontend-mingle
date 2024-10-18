import axios from "axios";

export const checkSession = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/session`, {
      withCredentials: true,
    });
    if (response.data.isAuthenticated) {
      return response.data.sessionId;
    }
  } catch (error) {
    console.error("Error checking session:", error);
  }
};
