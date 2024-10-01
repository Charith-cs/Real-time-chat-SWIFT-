import axios from "axios";

const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://real-time-chat-swift-back.vercel.app/api"
  : "/api";  // In development, this will still work with the Vite proxy

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, userCredentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "An error occurred during login.";
    dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
  }
};
