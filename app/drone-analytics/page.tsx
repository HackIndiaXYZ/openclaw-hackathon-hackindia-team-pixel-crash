'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DroneAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Drone Crop Analytics</h1>
          <p className="text-gray-600">Advanced agricultural intelligence through drone imaging and AI analysis</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Images
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Crop Health
            </TabsTrigger>
            <TabsTrigger value="disease" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Disease Detection
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Fields Analyzed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">12</div>
                  <p className="text-xs text-gray-500 mt-1">This season</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Crop Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">87%</div>
                  <p className="text-xs text-gray-500 mt-1">Healthy status</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Issues Detected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">3</div>
                  <p className="text-xs text-gray-500 mt-1">Requires action</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Coverage Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">245</div>
                  <p className="text-xs text-gray-500 mt-1">Hectares</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Analysis</CardTitle>
                <CardDescription>Latest drone analysis results from your fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">North Field (Wheat)</h4>
                      <p className="text-sm text-gray-500">Analyzed 2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">92% Healthy</p>
                      <p className="text-xs text-gray-500">8.5 hectares</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">South Field (Corn)</h4>
                      <p className="text-sm text-gray-500">Analyzed 1 day ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">78% Healthy</p>
                      <p className="text-xs text-gray-500">Pest activity detected</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">East Field (Rice)</h4>
                      <p className="text-sm text-gray-500">Analyzed 3 days ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">88% Healthy</p>
                      <p className="text-xs text-gray-500">Monitor irrigation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Drone Images</CardTitle>
                <CardDescription>Upload drone or satellite images for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Field Images</h3>
                  <p className="text-gray-600 mb-4">Drag and drop your drone images here or click to browse</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Select Images
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">Supported formats: JPG, PNG, TIFF (Max 100MB each)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Crop Health Score</CardTitle>
                <CardDescription>Visual health indicators for your fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { field: 'North Field (Wheat)', score: 92, trend: 'up' },
                    { field: 'South Field (Corn)', score: 78, trend: 'down' },
                    { field: 'East Field (Rice)', score: 88, trend: 'stable' },
                  ].map((item) => (
                    <div key={item.field}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{item.field}</span>
                        <span className="text-lg font-bold text-green-600">{item.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disease Detection Tab */}
          <TabsContent value="disease" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Disease Detection Results</CardTitle>
                <CardDescription>AI-detected diseases and issues in your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Leaf Spot Disease</h4>
                        <p className="text-sm text-gray-600 mt-1">Detected in South Field (Corn)</p>
                      </div>
                      <span className="inline-block bg-orange-200 text-orange-800 text-xs font-semibold px-3 py-1 rounded">
                        85% Confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">Recommendation: Apply fungicide treatment within 48 hours</p>
                  </div>

                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Nutrient Deficiency</h4>
                        <p className="text-sm text-gray-600 mt-1">Minor issue detected in East Field (Rice)</p>
                      </div>
                      <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1 rounded">
                        72% Confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">Recommendation: Apply balanced NPK fertilizer in next irrigation</p>
                  </div>

                  <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">No Major Issues</h4>
                        <p className="text-sm text-gray-600 mt-1">North Field (Wheat) - All Good</p>
                      </div>
                      <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded">
                        Healthy
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">Recommendation: Continue regular monitoring</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link href="/drone-analytics/upload">
            <Button className="bg-green-600 hover:bg-green-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Images
            </Button>
          </Link>
          <Link href="/drone-analytics/stress">
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Stress Analysis
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
