"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  MessageSquare,
  Recycle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getLocalStorage } from "@/utils/localStorage";
import { useAuth } from "@/context/UserAuthContext";

// Sample data for charts
const wasteData = [
  { name: "Jan", household: 40, recyclable: 24, hazardous: 10 },
  { name: "Feb", household: 30, recyclable: 28, hazardous: 8 },
  { name: "Mar", household: 35, recyclable: 30, hazardous: 12 },
  { name: "Apr", household: 45, recyclable: 32, hazardous: 9 },
  { name: "May", household: 38, recyclable: 35, hazardous: 7 },
  { name: "Jun", household: 42, recyclable: 38, hazardous: 11 },
];

// Sample upcoming pickups
const upcomingPickups = [
  {
    id: "1",
    date: "2024-04-15",
    time: "09:00 AM",
    type: "Household Waste",
    status: "Scheduled",
  },
  {
    id: "2",
    date: "2024-04-22",
    time: "09:00 AM",
    type: "Recyclable Waste",
    status: "Scheduled",
  },
];

// Sample recent issues
const recentIssues = [
  {
    id: "1",
    title: "Missed Pickup",
    date: "2024-04-01",
    status: "Resolved",
    description: "The scheduled pickup on Monday was missed.",
  },
  {
    id: "2",
    title: "Overflowing Bin",
    date: "2024-03-25",
    status: "In Progress",
    description: "The community bin near Block A is overflowing.",
  },
];

export default function UserDashboard() {
  const { userData } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData?.fullName || ""} Here's an overview of your
            waste management activities.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/user/schedule-pickup">
            <Button className="bg-user-primary hover:bg-user-secondary">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Pickup
            </Button>
          </Link>
          <Link href="/user/report-issues">
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pickups</CardTitle>
            <CalendarCheck className="h-4 w-4 text-user-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Household Waste
            </CardTitle>
            <Trash2 className="h-4 w-4 text-user-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">230 kg</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Recyclable Waste
            </CardTitle>
            <Recycle className="h-4 w-4 text-user-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187 kg</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Issues Reported
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-user-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 resolved, 1 in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Waste collection chart */}
      <Card>
        <CardHeader>
          <CardTitle>Waste Collection Overview</CardTitle>
          <CardDescription>
            Monthly breakdown of waste collection by type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={wasteData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="household"
                  name="Household Waste"
                  fill="#4CAF50"
                />
                <Bar
                  dataKey="recyclable"
                  name="Recyclable Waste"
                  fill="#8BC34A"
                />
                <Bar
                  dataKey="hazardous"
                  name="Hazardous Waste"
                  fill="#FF9800"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming pickups and recent issues */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Pickups</CardTitle>
              <CardDescription>Your scheduled waste pickups</CardDescription>
            </div>
            <Link href="/user/schedule-pickup">
              <Button variant="ghost" size="sm" className="gap-1">
                <span>View all</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPickups.map((pickup) => (
                <div key={pickup.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-user-muted p-2">
                    <CalendarClock className="h-4 w-4 text-user-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{pickup.type}</p>
                      <span className="text-xs text-user-primary font-medium">
                        {pickup.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(pickup.date).toLocaleDateString()} at{" "}
                      {pickup.time}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingPickups.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No upcoming pickups. Schedule one now!
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/user/schedule-pickup" className="w-full">
              <Button className="w-full bg-user-primary hover:bg-user-secondary">
                Schedule New Pickup
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>Issues you've reported</CardDescription>
            </div>
            <Link href="/user/report-issues">
              <Button variant="ghost" size="sm" className="gap-1">
                <span>View all</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-user-muted p-2">
                    <MessageSquare className="h-4 w-4 text-user-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{issue.title}</p>
                      <span
                        className={`text-xs font-medium ${
                          issue.status === "Resolved"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(issue.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs">{issue.description}</p>
                  </div>
                </div>
              ))}
              {recentIssues.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No recent issues reported.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/user/report-issues" className="w-full">
              <Button className="w-full bg-user-primary hover:bg-user-secondary">
                Report New Issue
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
