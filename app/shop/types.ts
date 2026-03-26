export type ProductCategory =
  | "All Categories"
  | "Fertilizers"
  | "Seeds"
  | "Pesticides"
  | "Irrigation Systems"
  | "Tools & Equipment"
  | "Safety Equipment"

export type ProductTag = "organic" | "sustainable" | "high-yield" | "water-saving" | "natural" | "digital"

export type ProductLabel = "Best Seller" | "New" | "10% Off" | "15% Off"

export interface Product {
  id: string
  name: string
  category: ProductCategory
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  tags: ProductTag[]
  label?: ProductLabel
  inStock: boolean
  stockCount?: number
}
