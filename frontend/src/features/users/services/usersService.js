import { get, put, del } from "../../../shared/services/api";

export async function fetchUsers(page = 1, limit = 50) {
  const response = await get(`/users?page=${page}&limit=${limit}`);
  return response;
}

export async function updateUser(id, payload) {
  const response = await put(`/users/${id}`, payload);
  return response?.user ?? response;
}

export async function deleteUser(id) {
  const response = await del(`/users/${id}`);
  return response;
}
