'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const healthData = [
  { date: 'Week 1', wheat: 85, corn: 72, rice: 80 },
  { date: 'Week 2', wheat: 87, corn: 75, rice: 82 },
  { date: 'Week 3', wheat: 90, corn: 78, rice: 85 },
  { date: 'Week 4', wheat: 92, corn: 78, rice: 88 },
]

const fieldHealthScores = [
  { field: 'North Field (Wheat)', score: 92, area: '8.5 ha', trend: 'improving' },
  { field: 'South Field (Corn)', score: 78, area: '6.2 ha', trend: 'declining' },
  { field: 'East Field (Rice)', score: 88, area: '7.8 ha', trend: 'stable' },
]

export default function CropHealthPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crop Health Score</h1>
          <p className="text-gray-600">Real-time health indicators for all your fields</p>
        </div>

        {/* Average Health Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">86%</div>
              <p className="text-xs text-gray-500 mt-2">Across all fields</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Healthiest Field</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">92%</div>
              <p className="text-xs text-gray-500 mt-2">North Field (Wheat)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Needs Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600">78%</div>
              <p className="text-xs text-gray-500 mt-2">South Field (Corn)</p>
            </CardContent>
          </Card>
        </div>

        {/* Health Trend Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Health Trend Over Time</CardTitle>
            <CardDescription>Monthly crop health scores for all fields</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="wheat" stroke="#10b981" name="Wheat" strokeWidth={2} />
                <Line type="monotone" dataKey="corn" stroke="#f59e0b" name="Corn" strokeWidth={2} />
                <Line type="monotone" dataKey="rice" stroke="#3b82f6" name="Rice" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Field Health Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Field Health Details</CardTitle>
            <CardDescription>Individual scores and recommendations for each field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {fieldHealthScores.map((field) => (
                <div key={field.field} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{field.field}</h3>
                      <p className="text-sm text-gray-500">Coverage area: {field.area}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{field.score}%</div>
                      <p className="text-xs text-gray-500 capitalize">{field.trend}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        field.score >= 85 ? 'bg-green-500' : field.score >= 75 ? 'bg-yellow-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${field.score}%` }}
                    />
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-700">
                    <strong>Recommendation:</strong> {getRecommendation(field.score)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function getRecommendation(score: number): string {
  if (score >= 90) return 'Excellent health! Continue regular monitoring and maintenance.'
  if (score >= 80) return 'Good health. Monitor closely and apply preventive measures if needed.'
  if (score >= 70) return 'Fair health. Consider irrigation, fertilization, or disease management.'
  return 'Poor health. Immediate action required. Contact agricultural expert.'
}
