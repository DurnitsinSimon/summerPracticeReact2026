export type Role = 'user' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: Role
}

export type PublicUser = Omit<User, 'password'>

export type ProductBadgeVariant = 'neutral' | 'negative' | 'positive'

export type Product = {
  id: string
  title: string
  price: number
  category: string
  badge?: { label: string; variant: ProductBadgeVariant }
}

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

const products: Product[] = [
  {
    id: 'product-1',
    title: 'Беспроводные наушники Aria',
    price: 6990,
    category: 'Электроника',
    badge: { label: 'Хит продаж', variant: 'positive' },
  },
  {
    id: 'product-2',
    title: 'Умные часы Pulse',
    price: 12490,
    category: 'Электроника',
    badge: { label: 'Новинка', variant: 'neutral' },
  },
  {
    id: 'product-3',
    title: 'Портативная колонка Wave',
    price: 4290,
    category: 'Электроника',
  },
  {
    id: 'product-4',
    title: 'Куртка утеплённая Nord',
    price: 8990,
    category: 'Одежда',
    badge: { label: '-15%', variant: 'negative' },
  },
  {
    id: 'product-5',
    title: 'Кроссовки Runner Pro',
    price: 5490,
    category: 'Одежда',
  },
  {
    id: 'product-6',
    title: 'Кофемашина Aroma',
    price: 15990,
    category: 'Дом',
    badge: { label: 'Новинка', variant: 'neutral' },
  },
  {
    id: 'product-7',
    title: 'Набор ножей Chef',
    price: 3490,
    category: 'Дом',
  },
  {
    id: 'product-8',
    title: 'Коврик для йоги Flex',
    price: 1990,
    category: 'Спорт',
    badge: { label: '-15%', variant: 'negative' },
  },
]

export function getProducts(): Product[] {
  return products
}
