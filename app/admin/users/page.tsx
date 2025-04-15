"use client"

import type React from "react"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  X,
  Shield,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample users data
const usersData = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    community: "Green Valley",
    role: "User",
    status: "Active",
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    community: "Eco Heights",
    role: "User",
    status: "Active",
    joinedDate: "2024-02-10",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    community: "Sustainable Gardens",
    role: "User",
    status: "Inactive",
    joinedDate: "2024-01-05",
  },
  {
    id: "4",
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    community: "Recycling Community",
    role: "User",
    status: "Active",
    joinedDate: "2024-03-20",
  },
  {
    id: "5",
    name: "David Chen",
    email: "david.chen@example.com",
    community: "Green Valley",
    role: "User",
    status: "Pending",
    joinedDate: "2024-04-01",
  },
  {
    id: "6",
    name: "Lisa Wong",
    email: "lisa.wong@example.com",
    community: "Eco Heights",
    role: "User",
    status: "Active",
    joinedDate: "2024-02-15",
  },
  {
    id: "7",
    name: "Tom Brown",
    email: "tom.brown@example.com",
    community: "Sustainable Gardens",
    role: "User",
    status: "Active",
    joinedDate: "2024-01-25",
  },
  {
    id: "8",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    community: "Recycling Community",
    role: "User",
    status: "Inactive",
    joinedDate: "2024-03-05",
  },
]

// Sample admin users data
const adminUsersData = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "System Administrator",
    department: "Waste Management",
    status: "Active",
    joinedDate: "2023-01-01",
  },
  {
    id: "2",
    name: "Operations Manager",
    email: "operations@example.com",
    role: "Operations Manager",
    department: "Operations",
    status: "Active",
    joinedDate: "2023-02-15",
  },
  {
    id: "3",
    name: "Support Admin",
    email: "support@example.com",
    role: "Support Administrator",
    department: "Customer Support",
    status: "Active",
    joinedDate: "2023-03-10",
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

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [communityFilter, setCommunityFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    community: "",
    role: "User",
    password: "",
    confirmPassword: "",
  })

  // New admin form state
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Support Administrator",
    department: "",
    password: "",
    confirmPassword: "",
  })

  // Filter users based on search query and filters
  const filteredUsers = usersData.filter((user) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !user.name.toLowerCase().includes(query) &&
        !user.email.toLowerCase().includes(query) &&
        !user.community.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    // Filter by status
    if (statusFilter && user.status !== statusFilter) {
      return false
    }

    // Filter by community
    if (communityFilter && user.community !== communityFilter) {
      return false
    }

    return true
  })

  // Filter admin users based on search query
  const filteredAdmins = adminUsersData.filter((admin) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.role.toLowerCase().includes(query) ||
        admin.department.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Paginate users
  const totalPages = Math.ceil((activeTab === "users" ? filteredUsers.length : filteredAdmins.length) / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const paginatedAdmins = filteredAdmins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("")
    setCommunityFilter("")
  }

  // Check if any filter is active
  const isFilterActive = searchQuery || statusFilter || communityFilter

  // Handle new user form change
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  // Handle new user community change
  const handleNewUserCommunityChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, community: value }))
  }

  // Handle new admin form change
  const handleNewAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAdmin((prev) => ({ ...prev, [name]: value }))
  }

  // Handle new admin role and department change
  const handleNewAdminSelectChange = (name: string, value: string) => {
    setNewAdmin((prev) => ({ ...prev, [name]: value }))
  }

  // Handle new user form submit
  const handleNewUserSubmit = () => {
    console.log("New user:", newUser)
    // In a real application, this would call an API to create a new user
    // Reset form
    setNewUser({
      name: "",
      email: "",
      community: "",
      role: "User",
      password: "",
      confirmPassword: "",
    })
  }

  // Handle new admin form submit
  const handleNewAdminSubmit = () => {
    console.log("New admin:", newAdmin)
    // In a real application, this would call an API to create a new admin
    // Reset form
    setNewAdmin({
      name: "",
      email: "",
      role: "Support Administrator",
      department: "",
      password: "",
      confirmPassword: "",
    })
  }

  // Handle sending notification to users
  const handleSendNotification = (userId: string) => {
    console.log(`Sending notification to user ${userId}`)
    // In a real application, this would open a dialog to compose and send a notification
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and administrators of the waste management system</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-admin-primary hover:bg-admin-secondary">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Enter the details for the new user.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="community">Community</Label>
                  <Select value={newUser.community} onValueChange={handleNewUserCommunityChange}>
                    <SelectTrigger id="community">
                      <SelectValue placeholder="Select a community" />
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
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    placeholder="Enter password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={handleNewUserChange}
                    placeholder="Confirm password"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-admin-primary hover:bg-admin-secondary" onClick={handleNewUserSubmit}>
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">
            <User className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Shield className="mr-2 h-4 w-4" />
            Administrators
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage community users of the waste management system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
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
                          <Label htmlFor="status">Status</Label>
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Statuses</SelectItem>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="community">Community</Label>
                          <Select value={communityFilter} onValueChange={setCommunityFilter}>
                            <SelectTrigger id="community">
                              <SelectValue placeholder="All Communities" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Communities</SelectItem>
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
                  {statusFilter && (
                    <div className="flex items-center gap-1 rounded-full bg-admin-muted px-3 py-1 text-xs">
                      <span>Status: {statusFilter}</span>
                      <button onClick={() => setStatusFilter("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {communityFilter && (
                    <div className="flex items-center gap-1 rounded-full bg-admin-muted px-3 py-1 text-xs">
                      <span>Community: {communityFilter}</span>
                      <button onClick={() => setCommunityFilter("")}>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Community</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.community}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : user.status === "Inactive"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>View Profile</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit User</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendNotification(user.id)}>
                                <Bell className="mr-2 h-4 w-4" />
                                <span>Send Notification</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete User</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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

        <TabsContent value="admins">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Administrators</CardTitle>
              <CardDescription>Manage administrators of the waste management system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search administrators..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-admin-primary hover:bg-admin-secondary">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add New Administrator</DialogTitle>
                        <DialogDescription>Enter the details for the new administrator.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="adminName">Full Name</Label>
                          <Input
                            id="adminName"
                            name="name"
                            value={newAdmin.name}
                            onChange={handleNewAdminChange}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminEmail">Email Address</Label>
                          <Input
                            id="adminEmail"
                            name="email"
                            type="email"
                            value={newAdmin.email}
                            onChange={handleNewAdminChange}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminRole">Role</Label>
                          <Select
                            value={newAdmin.role}
                            onValueChange={(value) => handleNewAdminSelectChange("role", value)}
                          >
                            <SelectTrigger id="adminRole">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="System Administrator">System Administrator</SelectItem>
                              <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                              <SelectItem value="Support Administrator">Support Administrator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminDepartment">Department</Label>
                          <Select
                            value={newAdmin.department}
                            onValueChange={(value) => handleNewAdminSelectChange("department", value)}
                          >
                            <SelectTrigger id="adminDepartment">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Waste Management">Waste Management</SelectItem>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="Customer Support">Customer Support</SelectItem>
                              <SelectItem value="IT">IT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminPassword">Password</Label>
                          <Input
                            id="adminPassword"
                            name="password"
                            type="password"
                            value={newAdmin.password}
                            onChange={handleNewAdminChange}
                            placeholder="Enter password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminConfirmPassword">Confirm Password</Label>
                          <Input
                            id="adminConfirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={newAdmin.confirmPassword}
                            onChange={handleNewAdminChange}
                            placeholder="Confirm password"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="bg-admin-primary hover:bg-admin-secondary" onClick={handleNewAdminSubmit}>
                          Add Administrator
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAdmins.length > 0 ? (
                    paginatedAdmins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.role}</TableCell>
                        <TableCell>{admin.department}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              admin.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {admin.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>View Profile</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Admin</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Remove Admin</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No administrators found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredAdmins.length)} of {filteredAdmins.length}{" "}
                    administrators
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
    </div>
  )
}
