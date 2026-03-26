"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Clock, ArrowLeft, TrendingUp, Brain, Calendar } from "lucide-react"
import Link from "next/link"

export default function PricePredictionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/features" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Link>
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <BarChart3 className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Market Price Predictions</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-driven price forecasting system to help farmers make better selling decisions
        </p>

        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          In Development - 75% Complete
        </Badge>
      </div>

      {/* Development Progress */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Development Progress
          </CardTitle>
          <CardDescription>Current status and expected completion timeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium">Expected Release</span>
              </div>
              <p className="text-sm text-gray-600">Q2 2024</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="font-medium">AI Model Training</span>
              </div>
              <p className="text-sm text-gray-600">85% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Price Forecasting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Advanced machine learning algorithms analyze historical data, weather patterns, and market trends to
              predict crop prices up to 6 months in advance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Real-time market analysis combining local and global factors affecting commodity prices, including supply
              chain disruptions and seasonal variations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selling Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Personalized recommendations on optimal selling times and strategies based on your specific crops,
              location, and market conditions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Development Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Development Milestones</CardTitle>
          <CardDescription>Key achievements and upcoming targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Data Collection & Processing</div>
                <div className="text-sm text-gray-600">
                  Historical price data from 50+ markets collected and processed
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">AI Model Development</div>
                <div className="text-sm text-gray-600">Machine learning models trained and validated</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">User Interface Development</div>
                <div className="text-sm text-gray-600">Building intuitive dashboards and visualization tools</div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                In Progress
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Beta Testing</div>
                <div className="text-sm text-gray-600">Testing with select farmers and gathering feedback</div>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                Upcoming
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
