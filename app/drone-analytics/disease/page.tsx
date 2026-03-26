'use client'

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'

const diseases = [
  {
    name: 'Leaf Spot Disease',
    field: 'South Field (Corn)',
    confidence: 85,
    severity: 'high',
    symptoms: ['Brown spots on leaves', 'Yellowing', 'Leaf curling'],
    treatment: 'Apply copper-based fungicide. Increase field ventilation. Remove infected leaves.',
  },
  {
    name: 'Powdery Mildew',
    field: 'East Field (Rice)',
    confidence: 72,
    severity: 'medium',
    symptoms: ['White powder coating', 'Reduced photosynthesis'],
    treatment: 'Apply sulfur-based fungicide. Improve water management. Increase sunlight exposure.',
  },
  {
    name: 'Rust Fungus',
    field: 'North Field (Wheat)',
    confidence: 68,
    severity: 'low',
    symptoms: ['Reddish-brown pustules'],
    treatment: 'Monitor closely. Apply preventive fungicide if conditions worsen.',
  },
]

export default function DiseaseDetectionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Disease Detection</h1>
          <p className="text-gray-600">AI-detected plant diseases with confidence levels and treatment recommendations</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Detected Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600">3</div>
              <p className="text-xs text-gray-500 mt-2">Requiring action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">75%</div>
              <p className="text-xs text-gray-500 mt-2">Detection accuracy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Fields Affected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600">2</div>
              <p className="text-xs text-gray-500 mt-2">Out of 3 fields</p>
            </CardContent>
          </Card>
        </div>

        {/* Disease Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detected Diseases</CardTitle>
            <CardDescription>All identified plant diseases with treatment recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {diseases.map((disease, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{disease.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{disease.field}</p>
                    </div>
                    <Badge
                      className={`${
                        disease.severity === 'high'
                          ? 'bg-red-100 text-red-800'
                          : disease.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {disease.confidence}% Confidence
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Symptoms Detected:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {disease.symptoms.map((symptom, sidx) => (
                        <li key={sidx}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      Recommended Treatment
                    </h4>
                    <p className="text-sm text-gray-700">{disease.treatment}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prevention Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Disease Prevention Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Maintain proper field ventilation and air circulation</li>
              <li>• Practice crop rotation to prevent soil-borne diseases</li>
              <li>• Use disease-resistant crop varieties when available</li>
              <li>• Apply preventive fungicides during high-risk seasons</li>
              <li>• Maintain proper irrigation schedules (avoid overwatering)</li>
              <li>• Remove and dispose of infected plant material promptly</li>
              <li>• Monitor fields regularly for early disease signs</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
