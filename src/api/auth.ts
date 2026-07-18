import type { PublicUser } from '../mocks/db'
import { parseResponse } from './http'

export type AuthResponse = {
  token: string
  user: PublicUser
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return parseResponse<AuthResponse>(response)
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return parseResponse<AuthResponse>(response)
}

export async function me(token: string): Promise<{ user: PublicUser }> {
  const response = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return parseResponse<{ user: PublicUser }>(response)
}
