import { http, HttpResponse } from 'msw'
import {
  createUser,
  findUserByCredentials,
  findUserByEmail,
  getUserByToken,
  issueToken,
  toPublicUser,
} from './db'

type LoginBody = { email: string; password: string }
type RegisterBody = { name: string; email: string; password: string }

function getBearerToken(request: Request): string | undefined {
  const header = request.headers.get('Authorization')
  return header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined
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
    const token = getBearerToken(request)
    const user = token ? getUserByToken(token) : undefined

    if (!user) {
      return HttpResponse.json({ message: 'Требуется авторизация' }, { status: 401 })
    }

    return HttpResponse.json({ user: toPublicUser(user) })
  }),
]
