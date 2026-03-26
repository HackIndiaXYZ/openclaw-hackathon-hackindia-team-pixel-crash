'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, TrendingUp, DollarSign } from 'lucide-react'

const markets = [
  {
    market: 'APMC Delhi',
    location: 'Delhi',
    distance: '12 km',
    crops: ['Wheat', 'Rice', 'Vegetables'],
    avgPrice: '₹2,400/quintal',
    demand: 'High',
    quality: 'Grade A preference',
  },
  {
    market: 'APMC Punjab (Mandi)',
    location: 'Punjab',
    distance: '250 km',
    crops: ['Wheat', 'Rice', 'Cotton'],
    avgPrice: '₹2,350/quintal',
    demand: 'Very High',
    quality: 'Premium quality',
  },
  {
    market: 'Safal',
    location: 'NCR Region',
    distance: '45 km',
    crops: ['Vegetables', 'Fruits'],
    avgPrice: '₹80-150/kg',
    demand: 'High',
    quality: 'Fresh produce',
  },
  {
    market: 'Private Buyers',
    location: 'Direct',
    distance: '0 km',
    crops: ['Specialty crops', 'Organic'],
    avgPrice: 'Variable',
    demand: 'Niche',
    quality: 'Contract farming',
  },
]

export default function BestMarketFinderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Best Market Finder</h1>
          <p className="text-gray-600">Location-aware market recommendations for your crops with real-time pricing</p>
        </div>

        {/* Crop Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find Best Market for Your Crop</CardTitle>
            <CardDescription>Select your primary crop to see recommended markets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Wheat', 'Rice', 'Corn', 'Cotton', 'Tomato', 'Onion', 'Potato', 'Carrot'].map((crop) => (
                <button
                  key={crop}
                  className="p-3 border rounded-lg hover:bg-green-50 hover:border-green-500 transition font-medium text-sm"
                >
                  {crop}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Recommendations */}
        <div className="space-y-4">
          {markets.map((market, idx) => (
            <Card key={idx} className="hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{market.market}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">{market.location} ({market.distance})</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Average Price</p>
                          <p className="font-medium text-green-600">{market.avgPrice}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Demand Level</p>
                          <p className="font-medium text-gray-900">{market.demand}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-l pl-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">Crops Traded</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {market.crops.map((crop) => (
                          <span key={crop} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Quality Requirements</p>
                      <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">{market.quality}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Best Market Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Check market demand before selecting harvest time</li>
              <li>• Maintain quality standards as per market preference</li>
              <li>• Consider transportation cost when calculating profit</li>
              <li>• Build relationships with consistent buyers</li>
              <li>• Monitor price trends for better timing</li>
              <li>• Consider contract farming for stable returns</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
