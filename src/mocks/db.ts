export type Role = 'user' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: Role
}

export type PublicUser = Omit<User, 'password'>

type StoredState = {
  users: User[]
  tokens: Record<string, string>
  nextUserId: number
}

const STORAGE_KEY = 'mock-db'

const seedAdmin: User = {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@shop.dev',
  password: 'admin123',
  role: 'admin',
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as StoredState
  } catch {
    // corrupted storage, fall back to a fresh seed below
  }
  return { users: [seedAdmin], tokens: {}, nextUserId: 1 }
}

// MSW handlers run inside the page's own module scope, not a real server process,
// so state must be persisted to localStorage to survive a page reload.
const state = loadState()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export function findUserByEmail(email: string): User | undefined {
  return state.users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export function findUserByCredentials(email: string, password: string): User | undefined {
  const user = findUserByEmail(email)
  return user && user.password === password ? user : undefined
}

export function createUser(input: { name: string; email: string; password: string }): User {
  const user: User = {
    id: `user-${state.nextUserId++}`,
    name: input.name,
    email: input.email,
    password: input.password,
    role: 'user',
  }
  state.users.push(user)
  persist()
  return user
}

export function issueToken(userId: string): string {
  const token = crypto.randomUUID()
  state.tokens[token] = userId
  persist()
  return token
}

export function getUserByToken(token: string): User | undefined {
  const userId = state.tokens[token]
  return userId ? state.users.find((user) => user.id === userId) : undefined
}
