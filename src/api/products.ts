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
