'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sprout, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function CropAdvisoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Crop Advisory</h1>
          <p className="text-gray-600">Smart crop recommendations, yield predictions, and disease prevention insights powered by AI</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Current Crop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Wheat</div>
              <p className="text-xs text-gray-500 mt-1">Season: Rabi 2024-25</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Expected Yield</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">55 q/ha</div>
              <p className="text-xs text-gray-500 mt-1">Based on forecast</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">Low</div>
              <p className="text-xs text-gray-500 mt-1">All conditions optimal</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700">Est. Profit/Acre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹45,800</div>
              <p className="text-xs text-green-600 mt-1">Revenue - Cost</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="yield" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Yield Prediction
            </TabsTrigger>
            <TabsTrigger value="disease" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Disease Prevention
            </TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Smart Crop Recommendations</CardTitle>
                <CardDescription>Based on soil, weather, and seasonal analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      crop: 'Wheat',
                      match: '95%',
                      reasoning: 'Excellent soil NPK, optimal weather conditions, proven high yield in your region',
                    },
                    {
                      crop: 'Barley',
                      match: '85%',
                      reasoning: 'Good soil conditions, slightly lower market demand, suitable alternative',
                    },
                    {
                      crop: 'Pulses (Chickpea)',
                      match: '72%',
                      reasoning: 'Rotation benefit, requires less nitrogen, but lower market prices currently',
                    },
                  ].map((rec) => (
                    <div key={rec.crop} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{rec.crop}</h4>
                        <span className="text-lg font-bold text-green-600">{rec.match}</span>
                      </div>
                      <p className="text-sm text-gray-600">{rec.reasoning}</p>
                    </div>
                  ))}
                </div>
                <Link href="/crop-suggestions">
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">View Full Analysis</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Yield Prediction Tab */}
          <TabsContent value="yield" className="space-y-6 mt-6">
            {/* Profit Breakdown Card */}
            <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-green-700">Estimated Profit Analysis</CardTitle>
                <CardDescription>Breakdown of expected revenue and costs for current season</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Expected Yield</p>
                    <p className="text-3xl font-bold text-green-600">166 q (22 ha)</p>
                    <p className="text-xs text-gray-500 mt-2">55 q/ha average</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Market Price (Current)</p>
                    <p className="text-3xl font-bold text-blue-600">₹2,650/q</p>
                    <p className="text-xs text-gray-500 mt-2">Average market rate</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Expected Revenue</p>
                    <p className="text-3xl font-bold text-purple-600">₹4,39,900</p>
                    <p className="text-xs text-gray-500 mt-2">Gross income</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seeds & Fertilizers:</span>
                      <span className="font-semibold text-gray-900">₹88,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pesticides:</span>
                      <span className="font-semibold text-gray-900">₹18,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Labor:</span>
                      <span className="font-semibold text-gray-900">₹132,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Utilities & Fuel:</span>
                      <span className="font-semibold text-gray-900">₹54,600</span>
                    </div>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-semibold text-gray-900">₹293,100</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-100 text-sm">Estimated Net Profit</p>
                      <p className="text-4xl font-bold">₹1,00,800</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-100 text-sm">Profit per Acre</p>
                      <p className="text-3xl font-bold">₹45,800</p>
                    </div>
                  </div>
                  <p className="text-green-100 text-xs mt-3">Based on current market rates and farming practices</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yield Prediction</CardTitle>
                <CardDescription>Estimated output based on current conditions and historical data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      field: 'North Field (8.5 ha)',
                      estimated: '55 q/ha',
                      confidence: '92%',
                      total: '467 quintals',
                    },
                    {
                      field: 'South Field (6.2 ha)',
                      estimated: '48 q/ha',
                      confidence: '85%',
                      total: '298 quintals',
                    },
                    {
                      field: 'East Field (7.8 ha)',
                      estimated: '52 q/ha',
                      confidence: '88%',
                      total: '406 quintals',
                    },
                  ].map((field) => (
                    <div key={field.field} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{field.field}</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{field.confidence} confidence</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Estimated Yield</p>
                          <p className="text-lg font-semibold text-blue-600">{field.estimated}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Production</p>
                          <p className="text-lg font-semibold text-green-600">{field.total}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/yield-prediction">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Detailed Yield Analysis</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disease Prevention Tab */}
          <TabsContent value="disease" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Disease Prevention Insights</CardTitle>
                <CardDescription>Early warning signs and prevention strategies for common diseases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Leaf Rust Risk</h4>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">LOW</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Conditions unfavorable for rust development</p>
                  </div>
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Powdery Mildew Risk</h4>
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">MODERATE</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Monitor closely. Apply preventive fungicide if needed</p>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Pest Activity</h4>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">LOW</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">No major pest alerts. Continue regular monitoring</p>
                  </div>
                </div>
                <Link href="/crop-advisory/disease-prevention">
                  <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">Prevention Guidelines</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
