"use client"

import { useState } from "react"
import { Bell, Check, ChevronLeft, ChevronRight, Filter, Search, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Sample notifications data
const notificationsData = [
  {
    id: "1",
    title: "Pickup Schedule Update",
    message: "Pickup schedules have been updated for Green Valley community.",
    sentTo: "Green Valley",
    sentDate: "2024-04-10",
    sentTime: "10:30 AM",
    type: "Announcement",
    status: "Sent",
  },
  {
    id: "2",
    title: "System Maintenance",
    message: "The system will be under maintenance on April 15, 2024, from 10:00 PM to 2:00 AM.",
    sentTo: "All Users",
    sentDate: "2024-04-09",
    sentTime: "02:45 PM",
    type: "System",
    status: "Sent",
  },
  {
    id: "3",
    title: "New Recycling Guidelines",
    message: "New recycling guidelines have been posted for all communities.",
    sentTo: "All Communities",
    sentDate: "2024-04-08",
    sentTime: "09:15 AM",
    type: "Announcement",
    status: "Sent",
  },
  {
    id: "4",
    title: "Special Hazardous Waste Collection",
    message: "Special hazardous waste collection scheduled for next Monday.",
    sentTo: "All Communities",
    sentDate: "2024-04-07",
    sentTime: "11:20 AM",
    type: "Pickup",
    status: "Sent",
  },
  {
    id: "5",
    title: "Community Cleanup Event",
    message: "Join us for a community cleanup event this Saturday at 10:00 AM.",
    sentTo: "Eco Heights",
    sentDate: "2024-04-06",
    sentTime: "03:30 PM",
    type: "Event",
    status: "Sent",
  },
]

// Sample communities data
const communitiesData = [
  { id: "1", name: "Green Valley" },
  { id: "2", name: "Eco Heights" },
  { id: "3", name: "Sustainable Gardens" },
  { id: "4", name: "Recycling Community" },
  { id: "5", name: "New Community" },
]

// Sample users data
const usersData = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    community: "Green Valley",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    community: "Eco Heights",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    community: "Sustainable Gardens",
  },
  {
    id: "4",
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    community: "Recycling Community",
  },
  {
    id: "5",
    name: "David Chen",
    email: "david.chen@example.com",
    community: "Green Valley",
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("send")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [recipientFilter, setRecipientFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // New notification form state
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "",
    recipientType: "all",
    community: "",
    specificUsers: [] as string[],
    sendEmail: true,
    sendInApp: true,
  })

  // Success message state
  const [successMessage, setSuccessMessage] = useState("")

  // Filter notifications based on search query and filters
  const filteredNotifications = notificationsData.filter((notification) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !notification.title.toLowerCase().includes(query) &&
        !notification.message.toLowerCase().includes(query) &&
        !notification.sentTo.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    // Filter by type
    if (typeFilter && notification.type !== typeFilter) {
      return false
    }

    // Filter by recipient
    if (recipientFilter && notification.sentTo !== recipientFilter) {
      return false
    }

    return true
  })

  // Paginate notifications
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setTypeFilter("")
    setRecipientFilter("")
  }

  // Check if any filter is active
  const isFilterActive = searchQuery || typeFilter || recipientFilter

  // Handle new notification form change
  const handleNewNotificationChange = (name: string, value: string | boolean | string[]) => {
    setNewNotification((prev) => ({ ...prev, [name]: value }))
  }

  // Handle user selection for specific users
  const handleUserSelection = (userId: string) => {
    setNewNotification((prev) => {
      const specificUsers = [...prev.specificUsers]
      if (specificUsers.includes(userId)) {
        return { ...prev, specificUsers: specificUsers.filter((id) => id !== userId) }
      } else {
        return { ...prev, specificUsers: [...specificUsers, userId] }
      }
    })
  }

  // Handle new notification form submit
  const handleSendNotification = () => {
    console.log("Sending notification:", newNotification)
    // In a real application, this would call an API to send the notification

    // Show success message
    setSuccessMessage("Notification sent successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)

    // Reset form
    setNewNotification({
      title: "",
      message: "",
      type: "",
      recipientType: "all",
      community: "",
      specificUsers: [],
      sendEmail: true,
      sendInApp: true,
    })

    // Switch to history tab
    setActiveTab("history")
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Send and manage notifications to users</p>
        </div>
      </div>

      <Tabs defaultValue="send" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">
            <Send className="mr-2 h-4 w-4" />
            Send Notification
          </TabsTrigger>
          <TabsTrigger value="history">
            <Bell className="mr-2 h-4 w-4" />
            Notification History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send New Notification</CardTitle>
              <CardDescription>Create and send a notification to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notification Title</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => handleNewNotificationChange("title", e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Notification Message</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => handleNewNotificationChange("message", e.target.value)}
                  placeholder="Enter notification message"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  value={newNotification.type}
                  onValueChange={(value) => handleNewNotificationChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Announcement">Announcement</SelectItem>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientType">Recipients</Label>
                <Select
                  value={newNotification.recipientType}
                  onValueChange={(value) => handleNewNotificationChange("recipientType", value)}
                >
                  <SelectTrigger id="recipientType">
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="community">Specific Community</SelectItem>
                    <SelectItem value="users">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newNotification.recipientType === "community" && (
                <div className="space-y-2">
                  <Label htmlFor="community">Community</Label>
                  <Select
                    value={newNotification.community}
                    onValueChange={(value) => handleNewNotificationChange("community", value)}
                  >
                    <SelectTrigger id="community">
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communitiesData.map((community) => (
                        <SelectItem key={community.id} value={community.name}>
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newNotification.recipientType === "users" && (
                <div className="space-y-2">
                  <Label>Select Users</Label>
                  <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {usersData.map((user) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={newNotification.specificUsers.includes(user.id)}
                            onCheckedChange={() => handleUserSelection(user.id)}
                          />
                          <Label htmlFor={`user-${user.id}`} className="flex-1">
                            <div className="flex flex-col">
                              <span>{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </Label>
                          <span className="text-xs text-muted-foreground">{user.community}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <Label>Notification Channels</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendEmail"
                      checked={newNotification.sendEmail}
                      onCheckedChange={(checked) => handleNewNotificationChange("sendEmail", checked === true)}
                    />
                    <Label htmlFor="sendEmail">Send Email Notification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendInApp"
                      checked={newNotification.sendInApp}
                      onCheckedChange={(checked) => handleNewNotificationChange("sendInApp", checked === true)}
                    />
                    <Label htmlFor="sendInApp">Send In-App Notification</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-admin-primary hover:bg-admin-secondary"
                onClick={handleSendNotification}
                disabled={!newNotification.title || !newNotification.message || !newNotification.type}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Notification History</CardTitle>
              <CardDescription>View all notifications sent to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                        {isFilterActive && <span className="ml-1 rounded-full bg-admin-primary w-2 h-2" />}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72" align="end">
                      <div className="space-y-4">
                        <h4 className="font-medium">Filters</h4>
                        <div className="space-y-2">
                          <Label htmlFor="type">Type</Label>
                          <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger id="type">
                              <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="Announcement">Announcement</SelectItem>
                              <SelectItem value="Pickup">Pickup</SelectItem>
                              <SelectItem value="System">System</SelectItem>
                              <SelectItem value="Event">Event</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recipient">Recipient</Label>
                          <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                            <SelectTrigger id="recipient">
                              <SelectValue placeholder="All Recipients" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Recipients</SelectItem>
                              <SelectItem value="All Users">All Users</SelectItem>
                              <SelectItem value="All Communities">All Communities</SelectItem>
                              {communitiesData.map((community) => (
                                <SelectItem key={community.id} value={community.name}>
                                  {community.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm" onClick={clearFilters}>
                            Clear Filters
                          </Button>
                          <Button size="sm" className="bg-admin-primary hover:bg-admin-secondary">
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {isFilterActive && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchQuery && (
                    <div className="flex items-center gap-1 rounded-full bg-admin-muted px-3 py-1 text-xs">
                      <span>Search: {searchQuery}</span>
                      <button onClick={() => setSearchQuery("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {typeFilter && (
                    <div className="flex items-center gap-1 rounded-full bg-admin-muted px-3 py-1 text-xs">
                      <span>Type: {typeFilter}</span>
                      <button onClick={() => setTypeFilter("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {recipientFilter && (
                    <div className="flex items-center gap-1 rounded-full bg-admin-muted px-3 py-1 text-xs">
                      <span>Recipient: {recipientFilter}</span>
                      <button onClick={() => setRecipientFilter("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <button className="text-xs text-admin-primary hover:underline" onClick={clearFilters}>
                    Clear all
                  </button>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sent To</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedNotifications.length > 0 ? (
                    paginatedNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {notification.message}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{notification.type}</TableCell>
                        <TableCell>{notification.sentTo}</TableCell>
                        <TableCell>
                          <div>
                            <p>{new Date(notification.sentDate).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">{notification.sentTime}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              notification.status === "Sent"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {notification.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No notifications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} of{" "}
                    {filteredNotifications.length} notifications
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="font-medium">
                      {currentPage}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md flex items-center gap-2">
          <Check className="h-5 w-5" />
          {successMessage}
        </div>
      )}
    </div>
  )
}
