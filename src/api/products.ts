import type { Product } from '../mocks/db'
import { parseResponse } from './http'

export async function listProducts(): Promise<Product[]> {
  const response = await fetch('/api/products')
  const data = await parseResponse<{ products: Product[] }>(response)
  return data.products
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`)
  const data = await parseResponse<{ product: Product }>(response)
  return data.product
}

export type CreateProductInput = {
  title: string
  price: number
  category: string
  description: string
}

export async function createProduct(token: string, input: CreateProductInput): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  })
  const data = await parseResponse<{ product: Product }>(response)
  return data.product
}

export async function deleteProduct(token: string, id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  await parseResponse<{ ok: true }>(response)
}
