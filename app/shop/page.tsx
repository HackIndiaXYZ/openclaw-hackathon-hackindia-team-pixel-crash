"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "./components/product-card"
import { Cart } from "./components/cart"
import { CartProvider } from "./cart-context"
import { products, categories, tags, sortOptions } from "./data"
import type { Product, ProductCategory, ProductTag } from "./types"

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("All Categories")
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory !== "All Categories") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((product) => selectedTags.some((tag) => product.tags.includes(tag)))
    }

    // Filter by price range
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        // In a real app, you'd sort by date added
        result.sort((a, b) => (a.label === "New" ? -1 : 1))
        break
      default:
        // Featured - no specific sorting
        break
    }

    setFilteredProducts(result)
  }, [selectedCategory, selectedTags, priceRange, searchQuery, sortBy])

  const toggleTag = (tag: ProductTag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <CartProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Agricultural Supplies Shop</h1>
            <p className="text-muted-foreground">Purchase high-quality farming supplies, seeds, equipment, and more</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 space-y-6">
            {/* Categories */}
            <div>
              <h2 className="font-medium mb-3">Categories</h2>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h2 className="font-medium mb-3">Price Range</h2>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 50000]}
                  min={0}
                  max={50000}
                  step={1000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mb-6"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">₹{priceRange[0].toLocaleString()}</span>
                  <span className="text-sm">₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Product Tags */}
            <div>
              <h2 className="font-medium mb-3">Product Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Cart />
              </div>
            </div>

            {/* Products Count */}
            <div className="mb-4">
              <h2 className="font-medium">Products ({filteredProducts.length})</h2>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CartProvider>
  )
}
