import { api } from "./axios";

export const loginAdmin = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

export const getAllApartments = async () => (await api.get("/apartments")).data;

export const getApartment = async (id: string | number) =>
  (await api.get(`/apartments/${id}`)).data;

export const createApartment = async (data: any) =>
  (await api.post("/apartments", data)).data;

export const updateApartment = async (id: string | number, data: any) =>
  (await api.put(`/apartments/${id}`, data)).data;

export const deleteApartment = async (id: string | number) =>
  (await api.delete(`/apartments/${id}`)).data;

export const toggleApartmentAvailability = async (
  id: string | number,
  available: boolean
) => (await api.put(`/apartments/${id}/availability`, { available })).data;

export const getAllUsers = async () => (await api.get("/users")).data;

export const getUser = async (id: string | number) =>
  (await api.get(`/users/${id}`)).data;

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // expects { token, user }
};

export const signup = async (payload: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const res = await api.post("/auth/register", payload);
  return res.data; // expects { token, user }
};