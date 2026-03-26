"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, Clock, ArrowLeft, Users, Heart, Calendar } from "lucide-react"
import Link from "next/link"

export default function CommunityForumPage() {
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
          <MessageCircle className="w-16 h-16 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Farmer Community Forum</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Social platform for knowledge sharing, community support, and collaborative farming
        </p>

        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          In Development - 25% Complete
        </Badge>
      </div>

      {/* Development Progress */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Development Progress
          </CardTitle>
          <CardDescription>Current status and expected completion timeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>25%</span>
            </div>
            <Progress value={25} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium">Expected Release</span>
              </div>
              <p className="text-sm text-gray-600">Q4 2024</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="font-medium">Community Features</span>
              </div>
              <p className="text-sm text-gray-600">30% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Discussion Forums</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Topic-based discussion forums for crop-specific advice, pest management, market trends, and general
              farming discussions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expert Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Connect with agricultural experts, extension officers, and experienced farmers for professional guidance
              and mentorship.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Collaborative knowledge base with best practices, success stories, and solutions to common farming
              challenges.
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
                <div className="font-medium">Platform Architecture</div>
                <div className="text-sm text-gray-600">
                  Designed community platform architecture and database schema
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">User Authentication</div>
                <div className="text-sm text-gray-600">Building secure user registration and profile management</div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                In Progress
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Forum Features</div>
                <div className="text-sm text-gray-600">Discussion threads, voting, and moderation tools</div>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                Upcoming
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Mobile App</div>
                <div className="text-sm text-gray-600">Mobile application for community access on-the-go</div>
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
