'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const npkData = [
  { nutrient: 'Nitrogen', current: 180, recommended: 200, unit: 'kg/ha' },
  { nutrient: 'Phosphorus', current: 45, recommended: 60, unit: 'kg/ha' },
  { nutrient: 'Potassium', current: 150, recommended: 180, unit: 'kg/ha' },
]

const recommendations = [
  {
    field: 'North Field (Wheat)',
    npk: '20-10-20',
    quantity: '50 kg/ha',
    timing: 'At sowing and 30 DAS',
    cost: '₹2,500',
  },
  {
    field: 'South Field (Corn)',
    npk: '25-15-15',
    quantity: '75 kg/ha',
    timing: 'At sowing, 30 DAS, 60 DAS',
    cost: '₹3,750',
  },
  {
    field: 'East Field (Rice)',
    npk: '15-20-15',
    quantity: '60 kg/ha',
    timing: 'At transplanting, 40 DAS, 70 DAS',
    cost: '₹3,000',
  },
]

export default function FertilizerRecommendationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fertilizer Recommendations</h1>
          <p className="text-gray-600">AI-powered NPK recommendations based on soil analysis and crop type</p>
        </div>

        {/* NPK Comparison Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nutrient Level Analysis</CardTitle>
            <CardDescription>Current vs. Recommended nutrient levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={npkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nutrient" />
                <YAxis label={{ value: 'kg/ha', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value} kg/ha`} />
                <Legend />
                <Bar dataKey="current" fill="#f59e0b" name="Current Level" />
                <Bar dataKey="recommended" fill="#10b981" name="Recommended Level" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fertilizer Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Field-wise Fertilizer Plan</CardTitle>
            <CardDescription>Customized recommendations for each field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Field</label>
                      <p className="font-semibold text-gray-900">{rec.field}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">NPK Ratio</label>
                      <p className="font-semibold text-green-600">{rec.npk}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Quantity</label>
                      <p className="font-semibold text-gray-900">{rec.quantity}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Application Timing</label>
                      <p className="font-semibold text-gray-900 text-sm">{rec.timing}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Estimated Cost</label>
                      <p className="font-semibold text-blue-600">{rec.cost}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Application Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">General Recommendations:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Apply fertilizers based on soil test results</li>
                  <li>Use split applications for better nutrient absorption</li>
                  <li>Apply N fertilizer in 3-4 splits for cereals</li>
                  <li>Apply P and K as basal dose or split with first dose of N</li>
                  <li>Water the field after fertilizer application</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Best Practices:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Use organic manure along with chemical fertilizers</li>
                  <li>Maintain proper soil pH for nutrient availability</li>
                  <li>Avoid over-application to prevent environmental damage</li>
                  <li>Use micronutrients if deficiencies are detected</li>
                  <li>Keep records of fertilizer application and crop response</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
