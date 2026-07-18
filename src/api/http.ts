export async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message ?? 'Что-то пошло не так')
  }
  return data as T
}
