'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Shield, Leaf } from 'lucide-react'

const preventionStrategies = [
  {
    disease: 'Leaf Rust',
    season: 'Winter & Spring',
    crops: 'Wheat, Barley',
    prevention: [
      'Use disease-resistant varieties',
      'Apply fungicide at early stage',
      'Avoid overhead irrigation',
      'Remove crop residues after harvest',
    ],
    earlyWarning: 'Look for orange pustules on leaf undersides',
  },
  {
    disease: 'Powdery Mildew',
    season: 'Cool & Dry',
    crops: 'All vegetables, grapes',
    prevention: [
      'Improve air circulation',
      'Avoid excessive nitrogen',
      'Apply sulfur-based fungicides',
      'Plant resistant varieties',
    ],
    earlyWarning: 'Fine white powder on leaves and stems',
  },
  {
    disease: 'Bacterial Blight',
    season: 'Warm & Wet',
    crops: 'Rice, Cotton',
    prevention: [
      'Use pathogen-free seeds',
      'Avoid waterlogging',
      'Apply copper fungicides',
      'Practice crop rotation',
    ],
    earlyWarning: 'Angular water-soaked lesions on leaves',
  },
]

export default function DiseasePrevention() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Disease Prevention Insights</h1>
          <p className="text-gray-600">Early warning signs and prevention strategies for common crop diseases</p>
        </div>

        {/* Key Prevention Strategies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Prevention First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Prevent disease through proper cultural practices and variety selection</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Early Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Monitor fields regularly and identify diseases at initial stages</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Leaf className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Integrated Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Combine cultural, biological, and chemical control methods</p>
            </CardContent>
          </Card>
        </div>

        {/* Disease-wise Prevention */}
        <div className="space-y-6">
          {preventionStrategies.map((item, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{item.disease}</CardTitle>
                    <CardDescription>
                      Crops affected: {item.crops} | Peak season: {item.season}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Prevention Measures:</h4>
                    <ul className="space-y-2">
                      {item.prevention.map((measure, midx) => (
                        <li key={midx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-600 font-bold">✓</span>
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      Early Warning Signs
                    </h4>
                    <p className="text-sm text-gray-700">{item.earlyWarning}</p>
                    <p className="text-xs text-gray-600 mt-3">Monitor your fields regularly for these symptoms and act immediately</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* General Best Practices */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>General Disease Prevention Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cultural Practices:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Practice crop rotation (3-4 year cycle)</li>
                  <li>Remove and destroy infected plant parts</li>
                  <li>Maintain proper field sanitation</li>
                  <li>Avoid working in wet fields</li>
                  <li>Clean tools and equipment between fields</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Variety Selection:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Choose disease-resistant varieties when available</li>
                  <li>Use certified disease-free seeds</li>
                  <li>Diversify crop varieties within a field</li>
                  <li>Update varieties periodically</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Chemical Management:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Use fungicides preventively before disease onset</li>
                  <li>Rotate fungicide groups to prevent resistance</li>
                  <li>Follow recommended dosages and timings</li>
                  <li>Maintain proper sprayer calibration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
