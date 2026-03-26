"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "../cart-context"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, itemCount, total } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Add some products to your cart to see them here.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-end my-4">
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <div className="text-sm text-muted-foreground">₹{item.product.price.toLocaleString()}</div>

                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>

                      <div className="ml-auto font-medium">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">₹{total.toLocaleString()}</span>
              </div>

              <Button className="w-full">Checkout</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
