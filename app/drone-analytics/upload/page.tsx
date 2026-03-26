'use client'

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function UploadDroneImagesPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)])
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Drone Images</h1>
          <p className="text-gray-600">Upload high-resolution drone or satellite images for AI-powered crop analysis</p>
        </div>

        <div className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Select Images</CardTitle>
              <CardDescription>Drag and drop or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
                  isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-500'
                }`}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Drone Images</h3>
                <p className="text-gray-600 mb-6">Drag your images here or click to browse</p>
                <Button className="bg-green-600 hover:bg-green-700">Browse Files</Button>
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <p>Supported formats: JPG, PNG, TIFF</p>
                  <p>Maximum file size: 100MB each</p>
                  <p>Recommended resolution: 4K or higher</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">{file}</span>
                      </div>
                      <span className="text-xs text-gray-500">Ready to analyze</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700">Start Analysis</Button>
                  <Button variant="outline">Add More Files</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Field Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Field Information</CardTitle>
              <CardDescription>Select the field where these images were taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Field</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>North Field (Wheat)</option>
                    <option>South Field (Corn)</option>
                    <option>East Field (Rice)</option>
                    <option>West Field (Pulses)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                  <input
                    type="text"
                    placeholder="e.g., Wheat, Corn, Rice"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    placeholder="Add any additional notes about these images..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
