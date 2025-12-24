import { request, isUseMock } from './client';
import { AuthSession, User } from '@/types';
import { MOCK_USERS } from '@/lib/mock-data';

export async function login(email: string, password: string): Promise<AuthSession> {
  if (isUseMock()) {
    // Mock login
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user || password !== 'password123') {
      throw new Error('Invalid email or password');
    }

    return {
      accessToken: `mock-token-${user.id}`,
      user,
    };
  }

  return request<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthSession> {
  if (isUseMock()) {
    // Mock register
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'USER',
      createdAt: new Date().toISOString(),
    };

    MOCK_USERS.push(newUser);

    return {
      accessToken: `mock-token-${newUser.id}`,
      user: newUser,
    };
  }

  return request<AuthSession>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export async function getMe(): Promise<User> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_USERS[0];
  }

  return request<User>('/auth/me');
}
