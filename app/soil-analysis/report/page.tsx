'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'

export default function SoilHealthReportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Soil Health Report</h1>
          <p className="text-gray-600">Comprehensive soil analysis reports with actionable insights</p>
        </div>

        {/* Recent Reports */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Download or view previous soil analysis reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { field: 'North Field (Wheat)', date: '15-Jan-2025', health: 'Excellent' },
                { field: 'South Field (Corn)', date: '10-Jan-2025', health: 'Good' },
                { field: 'East Field (Rice)', date: '05-Jan-2025', health: 'Good' },
              ].map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{report.field}</h4>
                      <p className="text-sm text-gray-500">{report.date} • Health: {report.health}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Latest Report Summary</CardTitle>
            <CardDescription>North Field (Wheat) - Generated on 15-Jan-2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">pH Level</p>
                  <p className="text-2xl font-bold text-green-600">7.2</p>
                  <p className="text-xs text-gray-500">Optimal</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Organic Matter</p>
                  <p className="text-2xl font-bold text-blue-600">3.8%</p>
                  <p className="text-xs text-gray-500">Good</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Nitrogen</p>
                  <p className="text-2xl font-bold text-green-600">180 kg/ha</p>
                  <p className="text-xs text-gray-500">Adequate</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Moisture</p>
                  <p className="text-2xl font-bold text-yellow-600">22%</p>
                  <p className="text-xs text-gray-500">Optimal</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Findings:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Soil structure is excellent with good water retention capacity</li>
                  <li>Microbial population is healthy</li>
                  <li>No heavy metal contamination detected</li>
                  <li>Phosphorus levels slightly below optimal - consider application</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Maintain current pH with regular lime application if needed</li>
                  <li>Continue organic matter addition through crop residue incorporation</li>
                  <li>Apply 60 kg/ha phosphorus for optimal crop yield</li>
                  <li>Monitor soil moisture and adjust irrigation accordingly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate New Report */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Create a new soil analysis report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Field</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>North Field (Wheat)</option>
                  <option>South Field (Corn)</option>
                  <option>East Field (Rice)</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button className="bg-green-600 hover:bg-green-700">Generate Report</Button>
                <Button variant="outline">Schedule Analysis</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
