"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  CreditCard,
  Shield,
  Calculator,
  Gift,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  IndianRupee,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  ExternalLink,
  PieChart,
  BarChart3,
  Target,
  Lightbulb,
  FileText,
  Users,
  Award,
  Zap,
  Globe,
  Star,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"

interface LoanApplication {
  id: string
  type: string
  amount: number
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  eligibilityScore: number
}

interface Insurance {
  id: string
  type: string
  premium: number
  coverage: number
  subsidy: number
  status: "active" | "expired" | "pending"
}

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  date: string
}

export default function AgroFinancePage() {
  const [activeTab, setActiveTab] = useState("loans")
  const [isListening, setIsListening] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI financial assistant. How can I help you with your agricultural finances today?",
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", category: "Seeds", amount: 5000, description: "Wheat seeds for winter crop", date: "2024-01-15" },
    { id: "2", category: "Fertilizer", amount: 8000, description: "Organic fertilizer", date: "2024-01-20" },
    { id: "3", category: "Equipment", amount: 15000, description: "Irrigation pipes", date: "2024-01-25" },
  ])
  const [newExpense, setNewExpense] = useState({ category: "", amount: "", description: "" })

  const { toast } = useToast()

  // Loan Eligibility Calculator State
  const [loanData, setLoanData] = useState({
    landSize: "",
    annualIncome: "",
    creditScore: "",
    farmingExperience: "",
    loanAmount: "",
    loanType: "kcc",
  })

  // Insurance Calculator State
  const [insuranceData, setInsuranceData] = useState({
    cropType: "",
    landArea: "",
    sumInsured: "",
    insuranceType: "pmfby",
  })

  // EMI Calculator State
  const [emiData, setEmiData] = useState({
    loanAmount: "",
    interestRate: "",
    tenure: "",
    paymentType: "monthly",
  })

  // Income Predictor State
  const [incomeData, setIncomeData] = useState({
    cropType: "",
    landArea: "",
    season: "kharif",
    location: "",
  })

  // Calculate loan eligibility score
  const calculateEligibilityScore = () => {
    const landScore = Math.min((Number.parseFloat(loanData.landSize) || 0) * 10, 30)
    const incomeScore = Math.min((Number.parseFloat(loanData.annualIncome) || 0) / 10000, 25)
    const creditScore = Math.min((Number.parseFloat(loanData.creditScore) || 0) / 10, 25)
    const experienceScore = Math.min((Number.parseFloat(loanData.farmingExperience) || 0) * 2, 20)

    return Math.min(landScore + incomeScore + creditScore + experienceScore, 100)
  }

  // Calculate insurance premium
  const calculateInsurancePremium = () => {
    const sumInsured = Number.parseFloat(insuranceData.sumInsured) || 0
    const area = Number.parseFloat(insuranceData.landArea) || 0
    const baseRate = insuranceData.insuranceType === "pmfby" ? 0.02 : 0.035
    const premium = sumInsured * area * baseRate
    const subsidy = premium * 0.5 // 50% government subsidy

    return { premium, subsidy, netPremium: premium - subsidy }
  }

  // Calculate EMI
  const calculateEMI = () => {
    const principal = Number.parseFloat(emiData.loanAmount) || 0
    const rate = (Number.parseFloat(emiData.interestRate) || 0) / 100 / 12
    const tenure = Number.parseFloat(emiData.tenure) || 0

    if (principal && rate && tenure) {
      const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1)
      return {
        emi: Math.round(emi),
        totalAmount: Math.round(emi * tenure),
        totalInterest: Math.round(emi * tenure - principal),
      }
    }
    return { emi: 0, totalAmount: 0, totalInterest: 0 }
  }

  // Predict income
  const predictIncome = () => {
    const area = Number.parseFloat(incomeData.landArea) || 0
    const baseYield =
      incomeData.cropType === "wheat"
        ? 3000
        : incomeData.cropType === "rice"
          ? 4000
          : incomeData.cropType === "cotton"
            ? 500
            : 2500
    const marketPrice =
      incomeData.cropType === "wheat"
        ? 25
        : incomeData.cropType === "rice"
          ? 30
          : incomeData.cropType === "cotton"
            ? 6000
            : 20

    const grossIncome = area * baseYield * marketPrice
    const costs = grossIncome * 0.4 // 40% of gross income as costs
    const netIncome = grossIncome - costs

    return { grossIncome, costs, netIncome, confidence: 85 }
  }

  // Handle voice input
  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true)
      // Simulate voice recognition
      setTimeout(() => {
        setCurrentMessage("What are the best loan options for small farmers?")
        setIsListening(false)
      }, 2000)
    } else {
      setIsListening(false)
    }
  }

  // Handle chat message
  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const newMessages = [
      ...chatMessages,
      { role: "user", content: currentMessage },
      {
        role: "assistant",
        content:
          "Based on your query, I recommend exploring Kisan Credit Card (KCC) loans which offer flexible repayment options and lower interest rates for farmers. Would you like me to help you check your eligibility?",
      },
    ]

    setChatMessages(newMessages)
    setCurrentMessage("")
  }

  // Add expense
  const addExpense = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all expense details.",
        variant: "destructive",
      })
      return
    }

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: Number.parseFloat(newExpense.amount),
      description: newExpense.description,
      date: new Date().toISOString().split("T")[0],
    }

    setExpenses([...expenses, expense])
    setNewExpense({ category: "", amount: "", description: "" })

    toast({
      title: "Expense Added",
      description: "Your expense has been recorded successfully.",
    })
  }

  // Delete expense
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id))
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed from your records.",
    })
  }

  const eligibilityScore = calculateEligibilityScore()
  const insurancePremium = calculateInsurancePremium()
  const emiCalculation = calculateEMI()
  const incomePredict = predictIncome()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Agro Finance Hub</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive financial solutions for farmers - from loans and insurance to income planning and expense
          tracking. Get AI-powered insights and access to government schemes.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <p className="text-2xl font-bold">₹2.5L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Insurance Coverage</p>
                <p className="text-2xl font-bold">₹5L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold">₹45K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Gift className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subsidies Received</p>
                <p className="text-2xl font-bold">₹12K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="loans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Loans
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Insurance
          </TabsTrigger>
          <TabsTrigger value="emi" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            EMI Planner
          </TabsTrigger>
          <TabsTrigger value="subsidies" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Subsidies
          </TabsTrigger>
          <TabsTrigger value="income" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Income Predictor
          </TabsTrigger>
          <TabsTrigger value="ledger" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Digital Ledger
          </TabsTrigger>
          <TabsTrigger value="schemes" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Schemes
          </TabsTrigger>
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        {/* Loan Management */}
        <TabsContent value="loans">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Eligibility Checker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Loan Eligibility Checker
                </CardTitle>
                <CardDescription>Get instant eligibility assessment for agricultural loans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landSize">Land Size (acres)</Label>
                    <Input
                      id="landSize"
                      type="number"
                      placeholder="Enter land size"
                      value={loanData.landSize}
                      onChange={(e) => setLoanData({ ...loanData, landSize: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                    <Input
                      id="annualIncome"
                      type="number"
                      placeholder="Enter annual income"
                      value={loanData.annualIncome}
                      onChange={(e) => setLoanData({ ...loanData, annualIncome: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="creditScore">Credit Score</Label>
                    <Input
                      id="creditScore"
                      type="number"
                      placeholder="Enter credit score"
                      value={loanData.creditScore}
                      onChange={(e) => setLoanData({ ...loanData, creditScore: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Farming Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="Years of experience"
                      value={loanData.farmingExperience}
                      onChange={(e) => setLoanData({ ...loanData, farmingExperience: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Select
                    value={loanData.loanType}
                    onValueChange={(value) => setLoanData({ ...loanData, loanType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kcc">Kisan Credit Card</SelectItem>
                      <SelectItem value="term">Agriculture Term Loan</SelectItem>
                      <SelectItem value="equipment">Equipment Finance</SelectItem>
                      <SelectItem value="crop">Crop Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Eligibility Score</span>
                    <span className="text-2xl font-bold">{eligibilityScore.toFixed(0)}%</span>
                  </div>
                  <Progress value={eligibilityScore} className="mb-2" />
                  <div className="flex items-center gap-2 text-sm">
                    {eligibilityScore >= 70 ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">High eligibility - Apply now!</span>
                      </>
                    ) : eligibilityScore >= 40 ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-600">Moderate eligibility - Consider improving credit score</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Low eligibility - Work on improving financial profile</span>
                      </>
                    )}
                  </div>
                </div>

                <Button className="w-full">Apply for Loan</Button>
              </CardContent>
            </Card>

            {/* Loan Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Loans</CardTitle>
                <CardDescription>Based on your profile and requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Kisan Credit Card</h3>
                      <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Flexible credit facility for agricultural needs with seasonal repayment
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Interest Rate:</span>
                        <span className="font-medium ml-2">7% - 9%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max Amount:</span>
                        <span className="font-medium ml-2">₹3 Lakhs</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tenure:</span>
                        <span className="font-medium ml-2">5 years</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Processing Fee:</span>
                        <span className="font-medium ml-2">Nil</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-3 bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Agriculture Term Loan</h3>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Long-term financing for farm development and equipment purchase
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Interest Rate:</span>
                        <span className="font-medium ml-2">8.5% - 11%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max Amount:</span>
                        <span className="font-medium ml-2">₹25 Lakhs</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tenure:</span>
                        <span className="font-medium ml-2">7 years</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Processing Fee:</span>
                        <span className="font-medium ml-2">0.5%</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-3 bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insurance Hub */}
        <TabsContent value="insurance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Premium Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Insurance Premium Calculator
                </CardTitle>
                <CardDescription>Calculate your crop insurance premium with government subsidy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Select
                    value={insuranceData.cropType}
                    onValueChange={(value) => setInsuranceData({ ...insuranceData, cropType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="sugarcane">Sugarcane</SelectItem>
                      <SelectItem value="maize">Maize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landArea">Land Area (acres)</Label>
                    <Input
                      id="landArea"
                      type="number"
                      placeholder="Enter area"
                      value={insuranceData.landArea}
                      onChange={(e) => setInsuranceData({ ...insuranceData, landArea: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sumInsured">Sum Insured per acre (₹)</Label>
                    <Input
                      id="sumInsured"
                      type="number"
                      placeholder="Enter sum insured"
                      value={insuranceData.sumInsured}
                      onChange={(e) => setInsuranceData({ ...insuranceData, sumInsured: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="insuranceType">Insurance Type</Label>
                  <Select
                    value={insuranceData.insuranceType}
                    onValueChange={(value) => setInsuranceData({ ...insuranceData, insuranceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pmfby">PMFBY (Pradhan Mantri Fasal Bima Yojana)</SelectItem>
                      <SelectItem value="weather">Weather Based Crop Insurance</SelectItem>
                      <SelectItem value="livestock">Livestock Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Premium Calculation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Premium:</span>
                      <span className="font-medium">₹{insurancePremium.premium.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Government Subsidy (50%):</span>
                      <span className="font-medium">-₹{insurancePremium.subsidy.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Your Premium:</span>
                      <span>₹{insurancePremium.netPremium.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Buy Insurance Policy</Button>
              </CardContent>
            </Card>

            {/* Insurance Products */}
            <Card>
              <CardHeader>
                <CardTitle>Available Insurance Products</CardTitle>
                <CardDescription>Comprehensive coverage for your agricultural needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">PMFBY - Crop Insurance</h3>
                      <Badge className="bg-green-100 text-green-800">Popular</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive risk coverage for crop loss due to natural calamities
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>✓ Natural disasters coverage</div>
                      <div>✓ Pest & disease protection</div>
                      <div>✓ 50% government subsidy</div>
                      <div>✓ Quick claim settlement</div>
                    </div>
                    <Button variant="outline" className="w-full mt-3 bg-transparent">
                      View Details
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Weather-Based Insurance</h3>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Protection against adverse weather conditions affecting crop yield
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>✓ Rainfall index based</div>
                      <div>✓ Temperature coverage</div>
                      <div>✓ Automatic claim trigger</div>
                      <div>✓ No crop cutting required</div>
                    </div>
                    <Button variant="outline" className="w-full mt-3 bg-transparent">
                      View Details
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Livestock Insurance</h3>
                      <Badge variant="outline">New</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive coverage for cattle, buffalo, and other livestock
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>✓ Death coverage</div>
                      <div>✓ Disease protection</div>
                      <div>✓ Accident coverage</div>
                      <div>✓ Veterinary expenses</div>
                    </div>
                    <Button variant="outline" className="w-full mt-3 bg-transparent">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* EMI Planner */}
        <TabsContent value="emi">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* EMI Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Smart EMI Calculator
                </CardTitle>
                <CardDescription>Plan your loan repayment with flexible EMI options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="Enter loan amount"
                      value={emiData.loanAmount}
                      onChange={(e) => setEmiData({ ...emiData, loanAmount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="Enter interest rate"
                      value={emiData.interestRate}
                      onChange={(e) => setEmiData({ ...emiData, interestRate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tenure">Tenure (months)</Label>
                    <Input
                      id="tenure"
                      type="number"
                      placeholder="Enter tenure"
                      value={emiData.tenure}
                      onChange={(e) => setEmiData({ ...emiData, tenure: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentType">Payment Type</Label>
                    <Select
                      value={emiData.paymentType}
                      onValueChange={(value) => setEmiData({ ...emiData, paymentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly EMI</SelectItem>
                        <SelectItem value="seasonal">Seasonal Payment</SelectItem>
                        <SelectItem value="harvest">Harvest-based Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">EMI Calculation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly EMI:</span>
                      <span className="font-bold text-lg">₹{emiCalculation.emi.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Amount Payable:</span>
                      <span className="font-medium">₹{emiCalculation.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Interest:</span>
                      <span className="font-medium">₹{emiCalculation.totalInterest.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-blue-700">
                    Consider seasonal payment option to align with your harvest cycle. This can reduce financial stress
                    during non-harvest months.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule & Options</CardTitle>
                <CardDescription>Choose the best repayment plan for your cash flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Monthly EMI</h3>
                      <Badge variant="outline">Traditional</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Fixed monthly payments throughout the loan tenure
                    </p>
                    <div className="text-lg font-bold text-green-600">₹{emiCalculation.emi.toLocaleString()}/month</div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Seasonal Payment</h3>
                      <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Pay during harvest seasons when cash flow is better
                    </p>
                    <div className="text-lg font-bold text-green-600">
                      ₹{(emiCalculation.emi * 6).toLocaleString()}/season
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Harvest-based Payment</h3>
                      <Badge variant="outline">Flexible</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Pay based on actual harvest income and market prices
                    </p>
                    <div className="text-lg font-bold text-green-600">Variable based on yield</div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Cash Flow Tips</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Plan EMIs around harvest seasons</li>
                      <li>• Keep 3-month EMI buffer for emergencies</li>
                      <li>• Consider crop insurance for payment protection</li>
                      <li>• Prepay during good harvest years</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subsidies Tracker */}
        <TabsContent value="subsidies">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Subsidies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Active Subsidies
                </CardTitle>
                <CardDescription>Track your current subsidy applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">PM-KISAN</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">₹6,000 annual income support</div>
                    <Progress value={75} className="mb-2" />
                    <div className="text-xs text-muted-foreground">Next installment: ₹2,000 in 15 days</div>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Soil Health Card</h4>
                      <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">Free soil testing subsidy</div>
                    <Progress value={40} className="mb-2" />
                    <div className="text-xs text-muted-foreground">Application under review</div>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">PMFBY Premium</h4>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">50% premium subsidy received</div>
                    <Progress value={100} className="mb-2" />
                    <div className="text-xs text-muted-foreground">₹3,500 subsidy credited</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Subsidies */}
            <Card>
              <CardHeader>
                <CardTitle>Available Subsidies</CardTitle>
                <CardDescription>New subsidies you can apply for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Drip Irrigation Subsidy</h4>
                      <Badge variant="outline">New</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Up to 55% subsidy on drip irrigation systems
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">85% match with your profile</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      Apply Now
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Organic Farming Subsidy</h4>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Financial support for organic certification
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">70% match with your profile</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      Learn More
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Equipment Purchase Subsidy</h4>
                      <Badge variant="outline">Limited Time</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">40% subsidy on agricultural equipment</div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3 text-orange-600" />
                      <span className="text-orange-600">Deadline: 30 days</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subsidy Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Subsidy Calendar
                </CardTitle>
                <CardDescription>Important dates and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Urgent</span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">PMFBY Application</div>
                      <div className="text-muted-foreground">Deadline: 5 days</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Upcoming</span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">PM-KISAN Installment</div>
                      <div className="text-muted-foreground">Expected: 15 days</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Completed</span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Soil Health Card</div>
                      <div className="text-muted-foreground">Received: 2 days ago</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">New Opportunity</span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Solar Pump Subsidy</div>
                      <div className="text-muted-foreground">Opens: 1 month</div>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Income Predictor */}
        <TabsContent value="income">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Income Predictor
                </CardTitle>
                <CardDescription>Predict your crop income using ML algorithms and market data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select
                      value={incomeData.cropType}
                      onValueChange={(value) => setIncomeData({ ...incomeData, cropType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="maize">Maize</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="landArea">Land Area (acres)</Label>
                    <Input
                      id="landArea"
                      type="number"
                      placeholder="Enter area"
                      value={incomeData.landArea}
                      onChange={(e) => setIncomeData({ ...incomeData, landArea: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="season">Season</Label>
                    <Select
                      value={incomeData.season}
                      onValueChange={(value) => setIncomeData({ ...incomeData, season: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                        <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                        <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter district/state"
                      value={incomeData.location}
                      onChange={(e) => setIncomeData({ ...incomeData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Income Prediction</h3>
                    <Badge className="bg-green-100 text-green-800">{incomePredict.confidence}% Confidence</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gross Income:</span>
                      <span className="font-bold text-lg text-green-600">
                        ₹{incomePredict.grossIncome.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Costs:</span>
                      <span className="font-medium text-red-600">-₹{incomePredict.costs.toLocaleString()}</span>
                    </div>

                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Net Income:</span>
                        <span className="font-bold text-xl text-blue-600">
                          ₹{incomePredict.netIncome.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Market Analysis
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Current Market Price:</span>
                      <span className="font-medium">₹25/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price Trend:</span>
                      <span className="text-green-600 font-medium">↗ +8% (30 days)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demand Forecast:</span>
                      <span className="text-green-600 font-medium">High</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Income Optimization</CardTitle>
                <CardDescription>AI-powered recommendations to maximize your income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Crop Diversification</h4>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      Consider growing cotton alongside wheat to increase income by 15-20%
                    </p>
                    <div className="text-xs text-green-600">Potential additional income: ₹45,000</div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-800">Technology Upgrade</h4>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      Drip irrigation can reduce water costs by 30% and increase yield by 25%
                    </p>
                    <div className="text-xs text-blue-600">ROI: 18 months</div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium text-purple-800">Market Timing</h4>
                    </div>
                    <p className="text-sm text-purple-700 mb-2">
                      Sell 60% of harvest in March when prices typically peak
                    </p>
                    <div className="text-xs text-purple-600">Expected price premium: 12-15%</div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium text-orange-800">Risk Management</h4>
                    </div>
                    <p className="text-sm text-orange-700 mb-2">
                      Crop insurance can protect 85% of your expected income
                    </p>
                    <div className="text-xs text-orange-600">Premium: ₹3,500 (after subsidy)</div>
                  </div>

                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Digital Ledger */}
        <TabsContent value="ledger">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Digital Expense Ledger
                </CardTitle>
                <CardDescription>Track and categorize your farming expenses with AI insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Expense */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Add New Expense</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Seeds">Seeds</SelectItem>
                        <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                        <SelectItem value="Fuel">Fuel</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Amount (₹)"
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                  <Input
                    placeholder="Description"
                    className="mb-3"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                  <Button onClick={addExpense} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </div>

                {/* Recent Expenses */}
                <div>
                  <h4 className="font-medium mb-3">Recent Expenses</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {expense.category}
                            </Badge>
                            <span className="text-sm font-medium">₹{expense.amount.toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{expense.description}</div>
                          <div className="text-xs text-muted-foreground">{expense.date}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => deleteExpense(expense.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Financial Insights
                </CardTitle>
                <CardDescription>AI-powered analysis of your spending patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Expense Breakdown */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Expense Breakdown (This Month)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Equipment</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "54%" }}></div>
                          </div>
                          <span className="text-sm font-medium">₹15,000</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Fertilizer</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "29%" }}></div>
                          </div>
                          <span className="text-sm font-medium">₹8,000</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Seeds</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "18%" }}></div>
                          </div>
                          <span className="text-sm font-medium">₹5,000</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between font-medium">
                        <span>Total Expenses:</span>
                        <span>₹28,000</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Smart Insights
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>
                          Equipment expenses are 20% higher than average. Consider bulk purchasing for better rates.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span>Fertilizer costs can be reduced by 15% with organic alternatives.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Your spending pattern shows good cost control compared to similar farms.</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Optimization */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Cost Optimization Tips</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Buy seeds in bulk during off-season for 10-15% savings</div>
                      <div>• Join farmer groups for collective equipment purchase</div>
                      <div>• Use government subsidies for fertilizer purchases</div>
                      <div>• Track fuel consumption to optimize machinery usage</div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Government Schemes */}
        <TabsContent value="schemes">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recommended Schemes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recommended for You
                </CardTitle>
                <CardDescription>Schemes matching your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">PM-KISAN</h4>
                      <Badge className="bg-green-100 text-green-800">95% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">₹6,000 annual income support for small farmers</p>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Already enrolled</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Status
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Kisan Credit Card</h4>
                      <Badge className="bg-blue-100 text-blue-800">88% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Flexible credit facility for agricultural needs
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Application pending</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Track Application
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Soil Health Card</h4>
                      <Badge className="bg-purple-100 text-purple-800">82% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Free soil testing and nutrient management</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Not applied</span>
                    </div>
                    <Button size="sm" className="w-full">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Track your scheme applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-800">PM-KISAN</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={100} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span>Applied</span>
                        <span>Verified</span>
                        <span>Approved</span>
                        <span>Active</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-green-700">Next installment: ₹2,000 on March 15, 2024</div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-800">PMFBY Insurance</h4>
                      <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={60} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span>Applied</span>
                        <span>Verified</span>
                        <span>Processing</span>
                        <span>Approval</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-blue-700">Expected approval: 7-10 working days</div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-yellow-800">Equipment Subsidy</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={40} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span>Applied</span>
                        <span>Review</span>
                        <span>Verification</span>
                        <span>Approval</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-yellow-700">Additional documents required</div>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Applications
                </Button>
              </CardContent>
            </Card>

            {/* Featured Schemes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Featured Schemes
                </CardTitle>
                <CardDescription>Popular government schemes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">PM Fasal Bima Yojana</h4>
                        <Badge variant="outline" className="text-xs">
                          Insurance
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Comprehensive crop insurance with premium subsidy
                    </p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Learn More
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">PM-KUSUM</h4>
                        <Badge variant="outline" className="text-xs">
                          Solar
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Solar pump and grid-connected solar power plants
                    </p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Learn More
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">FPO Promotion</h4>
                        <Badge variant="outline" className="text-xs">
                          Collective
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Support for Farmer Producer Organizations</p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Learn More
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Globe className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">e-NAM</h4>
                        <Badge variant="outline" className="text-xs">
                          Marketing
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">National Agriculture Market platform</p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Assistant */}
        <TabsContent value="assistant">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chat Interface */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Financial Assistant
                </CardTitle>
                <CardDescription>Get personalized financial advice and support in multiple languages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-3">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.role === "user" ? "bg-amber-600 text-white" : "bg-white border"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Ask about loans, insurance, subsidies..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="pr-12"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={toggleVoiceInput}
                      >
                        {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMessage("What are the best loan options for small farmers?")}
                    >
                      Loan Options
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMessage("How can I reduce my farming costs?")}
                    >
                      Cost Reduction
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMessage("Which government schemes am I eligible for?")}
                    >
                      Scheme Eligibility
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMessage("Help me plan my crop insurance")}
                    >
                      Insurance Planning
                    </Button>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-red-800">
                      <Phone className="h-4 w-4" />
                      Emergency Financial Support
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-red-600" />
                        <span>Kisan Call Center: 1551</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-red-600" />
                        <span>Banking Helpline: 1800-180-1111</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
