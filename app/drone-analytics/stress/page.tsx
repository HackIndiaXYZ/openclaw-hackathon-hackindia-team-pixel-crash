'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertTriangle, Droplets, Sun, Wind } from 'lucide-react'

const stressData = [
  { field: 'North Field\n(Wheat)', water: 30, heat: 45, nitrogen: 20, cold: 5 },
  { field: 'South Field\n(Corn)', water: 55, heat: 60, nitrogen: 40, cold: 10 },
  { field: 'East Field\n(Rice)', water: 25, heat: 35, nitrogen: 15, cold: 8 },
]

const stressTypes = [
  {
    type: 'Water Stress',
    icon: Droplets,
    description: 'Drought or waterlogging conditions',
    fields: ['South Field (Corn): Moderate', 'North Field (Wheat): Low'],
    action: 'Adjust irrigation schedules based on soil moisture levels',
  },
  {
    type: 'Heat Stress',
    icon: Sun,
    description: 'Excessive temperature conditions',
    fields: ['South Field (Corn): High', 'North Field (Wheat): Moderate'],
    action: 'Consider shade-loving crops or mulching techniques',
  },
  {
    type: 'Nutrient Stress',
    icon: AlertTriangle,
    description: 'Nutrient deficiency or excess',
    fields: ['South Field (Corn): Moderate', 'East Field (Rice): Low'],
    action: 'Conduct soil test and apply appropriate fertilizer',
  },
  {
    type: 'Wind Stress',
    icon: Wind,
    description: 'Excessive wind damage or lodging',
    fields: ['All fields: Low'],
    action: 'Monitor wind patterns and consider windbreaks if needed',
  },
]

export default function StressAnalysisPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stress Analysis & Recommended Actions</h1>
          <p className="text-gray-600">Identify environmental stressors affecting your crops and get actionable recommendations</p>
        </div>

        {/* Stress Levels Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Stress Levels by Type and Field</CardTitle>
            <CardDescription>Comparative stress analysis across your fields</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis label={{ value: 'Stress Level (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="water" fill="#3b82f6" name="Water Stress" />
                <Bar dataKey="heat" fill="#f59e0b" name="Heat Stress" />
                <Bar dataKey="nitrogen" fill="#10b981" name="Nutrient Stress" />
                <Bar dataKey="cold" fill="#6366f1" name="Cold Stress" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stress Type Details */}
        <div className="space-y-6">
          {stressTypes.map((stress, idx) => {
            const IconComponent = stress.icon
            return (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6 text-orange-600" />
                    <div>
                      <CardTitle className="text-xl">{stress.type}</CardTitle>
                      <CardDescription>{stress.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Affected Fields:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {stress.fields.map((field, fidx) => (
                          <li key={fidx}>{field}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Recommended Action:</h4>
                      <p className="text-sm text-gray-700">{stress.action}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Plan */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Prioritized Action Plan</CardTitle>
            <CardDescription>Recommended actions in order of priority</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">High Priority: Address water stress in South Field</h4>
                  <p className="text-sm text-gray-600 mt-1">Install soil moisture sensors and adjust irrigation schedule. Expected impact: +15% yield</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">Medium Priority: Heat stress management</h4>
                  <p className="text-sm text-gray-600 mt-1">Apply mulch and improve field ventilation. Consider crop varieties suited for hot climate</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">Low Priority: Nutrient management</h4>
                  <p className="text-sm text-gray-600 mt-1">Conduct soil test and create customized fertilizer plan for next season</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
