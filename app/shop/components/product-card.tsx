"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Product } from "../types"
import { Star } from "lucide-react"
import { useCart } from "../cart-context"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
        {product.label && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white rounded-md
            ${
              product.label === "Best Seller"
                ? "bg-yellow-500"
                : product.label === "New"
                  ? "bg-blue-500"
                  : product.label.includes("Off")
                    ? "bg-red-500"
                    : "bg-green-500"
            }`}
          >
            {product.label}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium mb-1">{product.name}</h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-1">
          {product.inStock
            ? product.stockCount
              ? `Only ${product.stockCount} left in stock`
              : "In Stock"
            : "Out of Stock"}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} disabled={!product.inStock} className="w-full" variant="outline">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
