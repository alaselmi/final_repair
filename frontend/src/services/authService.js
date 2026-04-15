import { login } from './api';

export async function loginUser(credentials) {
  const response = await login(credentials);
  return response;
}
