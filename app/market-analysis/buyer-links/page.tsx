'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Mail, Phone } from 'lucide-react'

const buyers = [
  {
    name: 'FreshFields Agro Trading',
    crops: ['Vegetables', 'Fruits'],
    minQuantity: '500 kg',
    price: 'Market rate +5%',
    contact: 'sales@freshfields.com',
    phone: '+91-9876543210',
  },
  {
    name: 'National Seed Corporation',
    crops: ['Seeds', 'Pulses'],
    minQuantity: '1 quintal',
    price: 'Negotiable',
    contact: 'procurement@nscindia.com',
    phone: '+91-8765432109',
  },
  {
    name: 'Organic Farms Collective',
    crops: ['Organic Produce'],
    minQuantity: '200 kg',
    price: 'Premium rate',
    contact: 'buy@organicfarmscollective.com',
    phone: '+91-7654321098',
  },
  {
    name: 'Export Quality Traders',
    crops: ['Cotton', 'Spices'],
    minQuantity: '2 quintal',
    price: 'Export parity',
    contact: 'export@qualitytraders.com',
    phone: '+91-6543210987',
  },
  {
    name: 'Food Processing Industries',
    crops: ['Tomato', 'Onion', 'Corn'],
    minQuantity: '1 ton',
    price: 'Volume discount',
    contact: 'procurement@foodpro.com',
    phone: '+91-5432109876',
  },
]

export default function DirectBuyerLinksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Direct Buyer Links</h1>
          <p className="text-gray-600">Connect directly with verified buyers and traders for your crops</p>
        </div>

        {/* Search/Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find Buyers for Your Crop</CardTitle>
            <CardDescription>Filter by crop type to see matching buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Organic'].map((crop) => (
                <button
                  key={crop}
                  className="px-4 py-2 border rounded-lg hover:bg-green-50 hover:border-green-500 transition font-medium text-sm"
                >
                  {crop}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buyers List */}
        <div className="space-y-4">
          {buyers.map((buyer, idx) => (
            <Card key={idx} className="hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{buyer.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Verified Buyer • Active since 2020</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Verified</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Crops Needed</p>
                    <div className="flex flex-wrap gap-1">
                      {buyer.crops.map((crop) => (
                        <span key={crop} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Minimum Quantity</p>
                    <p className="font-semibold text-gray-900">{buyer.minQuantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price Offered</p>
                    <p className="font-semibold text-green-600">{buyer.price}</p>
                  </div>
                </div>

                <div className="border-t pt-4 flex flex-wrap gap-3">
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Mail className="h-4 w-4" />
                    {buyer.contact}
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Phone className="h-4 w-4" />
                    {buyer.phone}
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2 ml-auto">
                    Connect Now
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Safety Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Safety Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Verify buyer credentials before engaging</li>
              <li>• Get written agreements for all transactions</li>
              <li>• Ensure quality checks before delivery</li>
              <li>• Use secure payment methods</li>
              <li>• Maintain records of all communications</li>
              <li>• Check references from other farmers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
