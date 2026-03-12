import axios from "axios";

const runtimeHost =
  typeof window !== "undefined" ? window.location.hostname : "localhost";
const runtimeProtocol =
  typeof window !== "undefined" ? window.location.protocol : "http:";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${runtimeProtocol}//${runtimeHost}:5000`;

export const getUploadUrl = (imageName) => `${API_BASE_URL}/uploads/${imageName}`;

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "X-App-Client": "admin",
  },
});

export default API;

