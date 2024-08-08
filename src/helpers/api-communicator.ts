import axios from "axios";

const api = axios.create({
  baseURL: "https://backendaibotmern-5.onrender.com/api/v1",
  withCredentials: true, // Include credentials in all requests
});

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/user/login", { email, password });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Unable to login");
    } else {
      throw new Error("An unknown error occurred during login.");
    }
  }
};

export const signupUser = async (name: string, email: string, password: string) => {
  try {
    const res = await api.post("/user/signup", { name, email, password });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Unable to Signup");
    } else {
      throw new Error("An unknown error occurred during signup.");
    }
  }
};

export const checkAuthStatus = async () => {
  try {
    const res = await api.get("/user/auth-status");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Unable to authenticate");
    } else {
      throw new Error("An unknown error occurred during authentication.");
    }
  }
};

export const sendChatRequest = async (message: string) => {
  try {
    const res = await api.post("/chat/new", { message });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Unable to send chat");
    } else {
      throw new Error("An unknown error occurred while sending chat.");
    }
  }
};

export const getUserChats = async () => {
  try {
    const res = await api.get("/chat/all-chats");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Unable to get chats");
    } else {
      throw new Error("An unknown error occurred while getting chats.");
    }
  }
};

export const deleteUserChats = async () => {
  try {
    const res = await api.delete("/chat/delete");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Unable to delete chats");
    } else {
      throw new Error("An unknown error occurred while deleting chats.");
    }
  }
};

export const logoutUser = async () => {
  try {
    const res = await api.get("/user/logout");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Unable to logout");
    } else {
      throw new Error("An unknown error occurred during logout.");
    }
  }
};
