import axios, { AxiosError } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // optional if you store user
      window.location.href = "/login";
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Request failed. Try again.";

    return Promise.reject({ status, message, data: error.response?.data });
  }
);