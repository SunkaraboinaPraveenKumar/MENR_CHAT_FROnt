import axios from "axios";

axios.defaults.baseURL = "https://mern-chat-backend-5.onrender.com/api/v1";
axios.defaults.withCredentials = true;

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("https://mern-chat-backend-5.onrender.com/api/v1/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  return res.data;
};

export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post("https://mern-chat-backend-5.onrender.com/api/v1/user/signup", { name, email, password });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("https://mern-chat-backend-5.onrender.com/api/v1/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  return res.data;
};

export const sendChatRequest = async (message: string) => {
  const res = await axios.post("https://mern-chat-backend-5.onrender.com/api/v1/chat/new", { message });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  return res.data;
};

export const getUserChats = async () => {
  const res = await axios.get("https://mern-chat-backend-5.onrender.com/api/v1/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to get chats");
  }
  return res.data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("https://mern-chat-backend-5.onrender.com/api/v1/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.get("https://mern-chat-backend-5.onrender.com/api/v1/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  return res.data;
};