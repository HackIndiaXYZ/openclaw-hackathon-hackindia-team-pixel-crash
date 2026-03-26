'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Leaf, BarChart3, FileText } from 'lucide-react'
import Link from 'next/link'

export default function SoilIntelligencePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Soil Intelligence</h1>
          <p className="text-gray-600">Advanced soil analysis, fertilizer recommendations, and health reports for optimal crop yield</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Last Soil Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">15 Jan 2025</div>
              <p className="text-xs text-gray-500 mt-1">North Field (Wheat)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Soil Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <p className="text-xs text-gray-500 mt-1">Excellent condition</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Fields Analyzed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">3/3</div>
              <p className="text-xs text-gray-500 mt-1">Current season</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Soil Analysis
            </TabsTrigger>
            <TabsTrigger value="fertilizer" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Fertilizer
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Soil Analysis Data</CardTitle>
                <CardDescription>Latest soil composition analysis for your fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { field: 'North Field (Wheat)', npk: '180-45-150', ph: '7.2', om: '3.8%' },
                    { field: 'South Field (Corn)', npk: '160-40-140', ph: '6.8', om: '3.2%' },
                    { field: 'East Field (Rice)', npk: '170-50-160', ph: '7.0', om: '3.5%' },
                  ].map((field) => (
                    <div key={field.field} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Field</p>
                          <p className="font-semibold text-gray-900">{field.field}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">NPK (kg/ha)</p>
                          <p className="font-semibold text-gray-900">{field.npk}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">pH</p>
                          <p className="font-semibold text-gray-900">{field.ph}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Organic Matter</p>
                          <p className="font-semibold text-gray-900">{field.om}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/soil-analysis">
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">View Full Analysis</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fertilizer" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fertilizer Recommendations</CardTitle>
                <CardDescription>AI-powered NPK recommendations based on soil test</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { field: 'North Field', npk: '20-10-20', qty: '50 kg/ha' },
                    { field: 'South Field', npk: '25-15-15', qty: '75 kg/ha' },
                    { field: 'East Field', npk: '15-20-15', qty: '60 kg/ha' },
                  ].map((rec) => (
                    <div key={rec.field} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{rec.field}</p>
                          <p className="text-sm text-gray-600">NPK: {rec.npk}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{rec.qty}</p>
                          <p className="text-xs text-gray-500">Per hectare</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/soil-analysis/fertilizer">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">View Detailed Recommendations</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Soil Health Reports</CardTitle>
                <CardDescription>Download comprehensive soil analysis reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 mb-3">Recent reports available for download:</p>
                  {['North Field - 15 Jan 2025', 'South Field - 10 Jan 2025', 'East Field - 05 Jan 2025'].map((report) => (
                    <div key={report} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-900">{report}</span>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
                <Link href="/soil-analysis/report">
                  <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">Generate New Report</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
