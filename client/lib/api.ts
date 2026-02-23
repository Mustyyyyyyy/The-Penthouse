const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface ApiError {
  status?: number;
  message?: string;
  msg?: string;
}

export async function apiFetch(
  endpoint: string,
  data: any = null,
  method: Method = "GET"
) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const config: RequestInit = {
    method,
    headers,
  };

  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    const contentType = res.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    const responseData = isJson ? await res.json() : null;

    if (!res.ok) {
      const error: ApiError = responseData || {};
      throw new Error(error.msg || error.message || "Request failed");
    }

    return responseData;
  } catch (err: any) {
    console.error("API ERROR:", err.message);
    throw new Error(err.message || "Network error");
  }
}


export const signup = (data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}) => apiFetch("/auth/register", data, "POST");

export const login = (data: { email: string; password: string }) =>
  apiFetch("/auth/login", data, "POST");

export const getProfile = () => apiFetch("/auth/profile");

   

export const getAllApartments = () => apiFetch("/apartments");

export const getApartment = (id: string) =>
  apiFetch(`/apartments/${id}`);

export const createApartment = (data: any) =>
  apiFetch("/apartments", data, "POST");

export const updateApartment = (id: string, data: any) =>
  apiFetch(`/apartments/${id}`, data, "PUT");

export const deleteApartment = (id: string) =>
  apiFetch(`/apartments/${id}`, null, "DELETE");

export const toggleApartmentAvailability = (id: string, available: boolean) =>
  apiFetch(`/apartments/${id}/availability`, { available }, "PUT");



export const getAllUsers = () => apiFetch("/users");
export const getUser = (id: string) => apiFetch(`/users/${id}`);