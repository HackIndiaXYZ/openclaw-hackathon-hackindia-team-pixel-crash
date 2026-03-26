"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { MarketPrice } from "@/services/market-data-service"
import { TrendingDown, TrendingUp } from "lucide-react"

interface MarketPriceCardProps {
  marketPrice: MarketPrice
  onClick: () => void
}

export function MarketPriceCard({ marketPrice, onClick }: MarketPriceCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer hover:translate-y-[-2px]`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{marketPrice.cropName}</h3>
              <p className="text-xs text-muted-foreground">{marketPrice.marketLocation}</p>
            </div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                marketPrice.trend === "up"
                  ? "bg-green-100 text-green-600"
                  : marketPrice.trend === "down"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
              }`}
            >
              {marketPrice.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold">₹{marketPrice.currentPrice.toLocaleString()}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-muted-foreground">{marketPrice.unit}</div>
              <div
                className={`text-sm font-medium ${
                  marketPrice.trend === "up"
                    ? "text-green-600"
                    : marketPrice.trend === "down"
                      ? "text-red-600"
                      : "text-blue-600"
                }`}
              >
                {marketPrice.change > 0 ? "+" : ""}
                {marketPrice.change.toLocaleString()} ({marketPrice.changePercentage > 0 ? "+" : ""}
                {marketPrice.changePercentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
        <div
          className={`h-1 w-full ${
            marketPrice.trend === "up" ? "bg-green-500" : marketPrice.trend === "down" ? "bg-red-500" : "bg-blue-500"
          }`}
        />
      </CardContent>
    </Card>
  )
}
