"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Plus,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const pickupsData = [
  {
    id: "1",
    date: "2024-04-15",
    time: "09:00 AM",
    community: "Green Valley",
    address: "Block A, Green Valley",
    type: "Household Waste",
    status: "Scheduled",
    assignedTo: "Team A",
  },
  {
    id: "2",
    date: "2024-04-15",
    time: "10:30 AM",
    community: "Eco Heights",
    address: "Main Street, Eco Heights",
    type: "Recyclable Waste",
    status: "Scheduled",
    assignedTo: "Team B",
  },
  {
    id: "3",
    date: "2024-04-16",
    time: "09:00 AM",
    community: "Sustainable Gardens",
    address: "Garden Road, Sustainable Gardens",
    type: "Household Waste",
    status: "Scheduled",
    assignedTo: "Team A",
  },
  {
    id: "4",
    date: "2024-04-16",
    time: "01:00 PM",
    community: "Recycling Community",
    address: "Recycle Avenue, Recycling Community",
    type: "Hazardous Waste",
    status: "Scheduled",
    assignedTo: "Team C",
  },
  {
    id: "5",
    date: "2024-04-14",
    time: "09:00 AM",
    community: "Green Valley",
    address: "Block B, Green Valley",
    type: "Household Waste",
    status: "Completed",
    assignedTo: "Team A",
  },
  {
    id: "6",
    date: "2024-04-14",
    time: "11:30 AM",
    community: "Eco Heights",
    address: "Park Street, Eco Heights",
    type: "Recyclable Waste",
    status: "Completed",
    assignedTo: "Team B",
  },
  {
    id: "7",
    date: "2024-04-13",
    time: "09:00 AM",
    community: "Sustainable Gardens",
    address: "Flower Road, Sustainable Gardens",
    type: "Household Waste",
    status: "Completed",
    assignedTo: "Team A",
  },
  {
    id: "8",
    date: "2024-04-13",
    time: "02:00 PM",
    community: "Recycling Community",
    address: "Green Street, Recycling Community",
    type: "Hazardous Waste",
    status: "Cancelled",
    assignedTo: "Team C",
  },
];

// Sample teams data
const teamsData = [
  { id: "1", name: "Team A" },
  { id: "2", name: "Team B" },
  { id: "3", name: "Team C" },
];

// Sample communities data
const communitiesData = [
  { id: "1", name: "Green Valley" },
  { id: "2", name: "Eco Heights" },
  { id: "3", name: "Sustainable Gardens" },
  { id: "4", name: "Recycling Community" },
  { id: "5", name: "New Community" },
];

export default function PickupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [communityFilter, setCommunityFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newPickup, setNewPickup] = useState({
    date: "",
    time: "",
    community: "",
    address: "",
    type: "",
    assignedTo: "",
  });

  const filteredPickups = pickupsData.filter((pickup) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !pickup.community.toLowerCase().includes(query) &&
        !pickup.address.toLowerCase().includes(query) &&
        !pickup.assignedTo.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (statusFilter && pickup.status !== statusFilter) {
      return false;
    }

    if (typeFilter && pickup.type !== typeFilter) {
      return false;
    }

    if (communityFilter && pickup.community !== communityFilter) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredPickups.length / itemsPerPage);
  const paginatedPickups = filteredPickups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setTypeFilter("");
    setCommunityFilter("");
  };

  const isFilterActive =
    searchQuery || statusFilter || typeFilter || communityFilter;

  const handleNewPickupChange = (name: string, value: string) => {
    setNewPickup((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewPickupSubmit = () => {
    console.log("New pickup:", newPickup);

    setNewPickup({
      date: "",
      time: "",
      community: "",
      address: "",
      type: "",
      assignedTo: "",
    });
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pickups</h1>
          <p className="text-muted-foreground">
            Manage and track waste collection pickups
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-admin-primary hover:bg-admin-secondary">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Pickup
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule New Pickup</DialogTitle>
                <DialogDescription>
                  Enter the details for the new waste pickup.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newPickup.date}
                      onChange={(e) =>
                        handleNewPickupChange("date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newPickup.time}
                      onChange={(e) =>
                        handleNewPickupChange("time", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="community">Community</Label>
                  <Select
                    value={newPickup.community}
                    onValueChange={(value) =>
                      handleNewPickupChange("community", value)
                    }
                  >
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
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newPickup.address}
                    onChange={(e) =>
                      handleNewPickupChange("address", e.target.value)
                    }
                    placeholder="Enter pickup address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Waste Type</Label>
                  <Select
                    value={newPickup.type}
                    onValueChange={(value) =>
                      handleNewPickupChange("type", value)
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Household Waste">
                        Household Waste
                      </SelectItem>
                      <SelectItem value="Recyclable Waste">
                        Recyclable Waste
                      </SelectItem>
                      <SelectItem value="Hazardous Waste">
                        Hazardous Waste
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select
                    value={newPickup.assignedTo}
                    onValueChange={(value) =>
                      handleNewPickupChange("assignedTo", value)
                    }
                  >
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamsData.map((team) => (
                        <SelectItem key={team.id} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="bg-admin-primary hover:bg-admin-secondary"
                  onClick={handleNewPickupSubmit}
                >
                  Schedule Pickup
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

      <Card>
        <CardHeader className="pb-3"></CardHeader>
        <CardContent>
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
              {typeFilter && (
                <div className="flex items-center gap-1 rounded-full bg-admin-muted px-3 py-1 text-xs">
                  <span>Type: {typeFilter}</span>
                  <button onClick={() => setTypeFilter("")}>
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
              <button
                className="text-xs text-admin-primary hover:underline"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPickups.length > 0 ? (
                paginatedPickups.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-admin-primary" />
                        <div>
                          <p className="font-medium">
                            {format(new Date(pickup.date), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pickup.time}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{pickup.community}</TableCell>
                    <TableCell>{pickup.address}</TableCell>
                    <TableCell>{pickup.type}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          pickup.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : pickup.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pickup.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-admin-primary" />
                        <span>{pickup.assignedTo}</span>
                      </div>
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
                            <span className="mr-2">📝</span>
                            <span>Edit Pickup</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span className="mr-2">✅</span>
                            <span>Mark as Completed</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span className="mr-2">🔔</span>
                            <span>Send Reminder</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <span className="mr-2">❌</span>
                            <span>Cancel Pickup</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No pickups found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredPickups.length)}{" "}
                of {filteredPickups.length} pickups
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
