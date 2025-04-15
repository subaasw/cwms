"use client"

import { useState } from "react"
import { Calendar, Download, FileText, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const monthlyData = [
  { name: "Jan", household: 1200, recyclable: 800, hazardous: 300 },
  { name: "Feb", household: 1100, recyclable: 850, hazardous: 280 },
  { name: "Mar", household: 1300, recyclable: 900, hazardous: 320 },
  { name: "Apr", household: 1150, recyclable: 950, hazardous: 290 },
  { name: "May", household: 1250, recyclable: 1000, hazardous: 310 },
  { name: "Jun", household: 1400, recyclable: 1050, hazardous: 330 },
]

const communityData = [
  { name: "Green Valley", value: 35, color: "#1976D2" },
  { name: "Eco Heights", value: 25, color: "#2196F3" },
  { name: "Sustainable Gardens", value: 20, color: "#64B5F6" },
  { name: "Recycling Community", value: 15, color: "#90CAF9" },
  { name: "New Community", value: 5, color: "#BBDEFB" },
]

const issueData = [
  { name: "Jan", issues: 12, resolved: 10 },
  { name: "Feb", issues: 15, resolved: 13 },
  { name: "Mar", issues: 18, resolved: 15 },
  { name: "Apr", issues: 14, resolved: 12 },
  { name: "May", issues: 16, resolved: 14 },
  { name: "Jun", issues: 20, resolved: 17 },
]

// Sample report types
const reportTypes = [
  { id: "waste-collection", name: "Waste Collection Report" },
  { id: "community-performance", name: "Community Performance Report" },
  { id: "issue-resolution", name: "Issue Resolution Report" },
  { id: "recycling-metrics", name: "Recycling Metrics Report" },
  { id: "operational-efficiency", name: "Operational Efficiency Report" },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("generate")
  const [reportType, setReportType] = useState("")
  const [timeFrame, setTimeFrame] = useState("monthly")
  const [community, setCommunity] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<boolean>(false)

  // Sample communities data
  const communities = [
    { id: "1", name: "Green Valley" },
    { id: "2", name: "Eco Heights" },
    { id: "3", name: "Sustainable Gardens" },
    { id: "4", name: "Recycling Community" },
    { id: "5", name: "New Community" },
  ]

  const handleGenerateReport = () => {
    if (!reportType) return

    setIsGenerating(true)

    // Simulate API call to generate report
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedReport(true)
      setActiveTab("view")
    }, 1500)
  }

  const handleDownloadReport = (format: string) => {
    // In a real application, this would trigger a download of the report
    console.log(`Downloading report in ${format} format`)
  }

  const handlePrintReport = () => {
    // In a real application, this would open the print dialog
    console.log("Printing report")
  }

  const handleSendNotification = () => {
    // In a real application, this would send a notification to users
    console.log("Sending notification to users")
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and view waste management reports</p>
        </div>
      </div>

      <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </TabsTrigger>
          <TabsTrigger value="view" disabled={!generatedReport}>
            <Calendar className="mr-2 h-4 w-4" />
            View Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>Select the type of report you want to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="reportType">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFrame">Time Frame</Label>
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                  <SelectTrigger id="timeFrame">
                    <SelectValue placeholder="Select time frame" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="community">Community (Optional)</Label>
                <Select value={community} onValueChange={setCommunity}>
                  <SelectTrigger id="community">
                    <SelectValue placeholder="All Communities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Communities</SelectItem>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-admin-primary hover:bg-admin-secondary"
                onClick={handleGenerateReport}
                disabled={!reportType || isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Waste Collection Report</CardTitle>
              <CardDescription>Monthly waste collection data across all communities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Report Details</h3>
                  <p className="text-sm text-muted-foreground">Generated on April 15, 2024</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport("pdf")}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport("excel")}>
                    <Download className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrintReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Monthly Waste Collection</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="household" name="Household Waste" fill="#1976D2" />
                      <Bar dataKey="recyclable" name="Recyclable Waste" fill="#64B5F6" />
                      <Bar dataKey="hazardous" name="Hazardous Waste" fill="#FF9800" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Waste Collection by Community</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={communityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {communityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Issues Reported vs Resolved</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={issueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="issues"
                        name="Issues Reported"
                        stroke="#1976D2"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="resolved" name="Issues Resolved" stroke="#4CAF50" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("generate")}>
                Generate New Report
              </Button>
              <Button className="bg-admin-primary hover:bg-admin-secondary" onClick={handleSendNotification}>
                Share Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
