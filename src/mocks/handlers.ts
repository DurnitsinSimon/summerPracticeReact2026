import { http, HttpResponse } from 'msw'
import {
  createProduct,
  createUser,
  deleteProduct,
  findUserByCredentials,
  findUserByEmail,
  getProduct,
  getProducts,
  getUserByToken,
  issueToken,
  toPublicUser,
  type User,
} from './db'

type LoginBody = { email: string; password: string }
type RegisterBody = { name: string; email: string; password: string }
type CreateProductBody = { title: string; price: number; category: string; description: string }

function getBearerToken(request: Request): string | undefined {
  const header = request.headers.get('Authorization')
  return header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined
}

function getAuthenticatedUser(request: Request): User | undefined {
  const token = getBearerToken(request)
  return token ? getUserByToken(token) : undefined
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginBody
    const user = findUserByCredentials(email, password)

    if (!user) {
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    }

    return HttpResponse.json({ token: issueToken(user.id), user: toPublicUser(user) })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const { name, email, password } = (await request.json()) as RegisterBody

    if (findUserByEmail(email)) {
      return HttpResponse.json({ message: 'Пользователь с таким email уже существует' }, { status: 409 })
    }

    const user = createUser({ name, email, password })
    return HttpResponse.json({ token: issueToken(user.id), user: toPublicUser(user) })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const user = getAuthenticatedUser(request)

    if (!user) {
      return HttpResponse.json({ message: 'Требуется авторизация' }, { status: 401 })
    }

    return HttpResponse.json({ user: toPublicUser(user) })
  }),

  http.get('/api/products', () => {
    return HttpResponse.json({ products: getProducts() })
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = getProduct(params.id as string)

    if (!product) {
      return HttpResponse.json({ message: 'Товар не найден' }, { status: 404 })
    }

    return HttpResponse.json({ product })
  }),

  http.post('/api/products', async ({ request }) => {
    const user = getAuthenticatedUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Недостаточно прав' }, { status: 403 })
    }

    const body = (await request.json()) as CreateProductBody
    if (!body.title || !body.category || !body.description || !(body.price > 0)) {
      return HttpResponse.json({ message: 'Проверьте поля товара' }, { status: 400 })
    }

    const product = createProduct(body)
    return HttpResponse.json({ product }, { status: 201 })
  }),

  http.delete('/api/products/:id', ({ request, params }) => {
    const user = getAuthenticatedUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Недостаточно прав' }, { status: 403 })
    }

    const deleted = deleteProduct(params.id as string)
    if (!deleted) {
      return HttpResponse.json({ message: 'Товар не найден' }, { status: 404 })
    }

    return HttpResponse.json({ ok: true })
  }),
]
