"use client"
import Link from "next/link"
import { ChevronRight, FileText, MessageSquare, Trash2, Truck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

// Sample upcoming pickups
const upcomingPickups = [
  {
    id: "1",
    date: "2024-04-15",
    community: "Green Valley",
    type: "Household Waste",
    count: 12,
  },
  {
    id: "2",
    date: "2024-04-15",
    community: "Eco Heights",
    type: "Recyclable Waste",
    count: 8,
  },
  {
    id: "3",
    date: "2024-04-16",
    community: "Sustainable Gardens",
    type: "Household Waste",
    count: 10,
  },
  {
    id: "4",
    date: "2024-04-16",
    community: "Recycling Community",
    type: "Hazardous Waste",
    count: 5,
  },
]

// Sample recent issues
const recentIssues = [
  {
    id: "1",
    title: "Missed Pickup",
    community: "Green Valley",
    date: "2024-04-10",
    status: "Open",
    priority: "High",
  },
  {
    id: "2",
    title: "Overflowing Bin",
    community: "Eco Heights",
    date: "2024-04-09",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "3",
    title: "Illegal Dumping",
    community: "Sustainable Gardens",
    date: "2024-04-08",
    status: "Resolved",
    priority: "High",
  },
  {
    id: "4",
    title: "Damaged Bin",
    community: "Recycling Community",
    date: "2024-04-07",
    status: "Open",
    priority: "Low",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of waste management activities across all communities</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-admin-primary hover:bg-admin-secondary">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Communities</CardTitle>
            <Users className="h-4 w-4 text-admin-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+1 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Waste Collected</CardTitle>
            <Trash2 className="h-4 w-4 text-admin-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,250 kg</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Pickups</CardTitle>
            <Truck className="h-4 w-4 text-admin-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">For the next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <MessageSquare className="h-4 w-4 text-admin-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 high priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Waste Collection</CardTitle>
            <CardDescription>Total waste collected by type (in kg)</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues Reported vs Resolved</CardTitle>
            <CardDescription>Monthly comparison of reported and resolved issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={issueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="issues" name="Issues Reported" stroke="#1976D2" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="resolved" name="Issues Resolved" stroke="#4CAF50" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Pickups</CardTitle>
              <CardDescription>Scheduled pickups for the next 7 days</CardDescription>
            </div>
            <Link href="/admin/pickups">
              <Button variant="ghost" size="sm" className="gap-1">
                <span>View all</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingPickups.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell>{new Date(pickup.date).toLocaleDateString()}</TableCell>
                    <TableCell>{pickup.community}</TableCell>
                    <TableCell>{pickup.type}</TableCell>
                    <TableCell>{pickup.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Link href="/admin/pickups" className="w-full">
              <Button className="w-full bg-admin-primary hover:bg-admin-secondary">Manage Pickups</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>Latest reported issues across communities</CardDescription>
            </div>
            <Link href="/admin/issues">
              <Button variant="ghost" size="sm" className="gap-1">
                <span>View all</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>{issue.title}</TableCell>
                    <TableCell>{issue.community}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          issue.status === "Open"
                            ? "bg-red-100 text-red-800"
                            : issue.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          issue.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : issue.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {issue.priority}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Link href="/admin/issues" className="w-full">
              <Button className="w-full bg-admin-primary hover:bg-admin-secondary">Manage Issues</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Waste Collection by Community</CardTitle>
          <CardDescription>Percentage of total waste collected by each community</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}
