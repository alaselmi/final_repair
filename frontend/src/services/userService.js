import { get } from './api';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchUsers() {
  const response = await get('/users');
  return Array.isArray(response?.users) ? response.users : [];
}

export async function updateUser(id, payload) {
  await delay(250);
  return { ...payload, id };
}

export async function deleteUser(id) {
  await delay(200);
  return { id };
}
