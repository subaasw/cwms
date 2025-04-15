"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

// Sample issues data
const issuesData = [
  {
    id: "1",
    title: "Missed Pickup",
    description: "The scheduled pickup on Monday was missed.",
    community: "Green Valley",
    reportedBy: "John Doe",
    reportedDate: "2024-04-10",
    status: "Open",
    priority: "High",
  },
  {
    id: "2",
    title: "Overflowing Bin",
    description: "The community bin near Block A is overflowing.",
    community: "Eco Heights",
    reportedBy: "Jane Smith",
    reportedDate: "2024-04-09",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "3",
    title: "Illegal Dumping",
    description: "Someone has dumped construction waste near the park.",
    community: "Sustainable Gardens",
    reportedBy: "Mike Johnson",
    reportedDate: "2024-04-08",
    status: "Resolved",
    priority: "High",
  },
  {
    id: "4",
    title: "Damaged Bin",
    description: "The bin at 123 Garden St is damaged and needs replacement.",
    community: "Recycling Community",
    reportedBy: "Sarah Lee",
    reportedDate: "2024-04-07",
    status: "Open",
    priority: "Low",
  },
  {
    id: "5",
    title: "Missed Recyclables",
    description: "The recyclable waste was not collected separately.",
    community: "Green Valley",
    reportedBy: "David Chen",
    reportedDate: "2024-04-06",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "6",
    title: "Waste Not Sorted",
    description: "Waste was not properly sorted for collection.",
    community: "Eco Heights",
    reportedBy: "Lisa Wong",
    reportedDate: "2024-04-05",
    status: "Resolved",
    priority: "Low",
  },
  {
    id: "7",
    title: "Late Pickup",
    description: "The pickup was scheduled for 9 AM but arrived at 2 PM.",
    community: "Sustainable Gardens",
    reportedBy: "Tom Brown",
    reportedDate: "2024-04-04",
    status: "Resolved",
    priority: "Medium",
  },
  {
    id: "8",
    title: "Hazardous Waste Concern",
    description: "Improper disposal of hazardous waste observed.",
    community: "Recycling Community",
    reportedBy: "Emma Wilson",
    reportedDate: "2024-04-03",
    status: "Open",
    priority: "High",
  },
];

export default function IssuesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [communityFilter, setCommunityFilter] = useState<string>("");

  // Get unique communities for filter
  const communities = Array.from(
    new Set(issuesData.map((issue) => issue.community))
  );

  // Filter issues based on search query and filters
  const filteredIssues = issuesData.filter((issue) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !issue.title.toLowerCase().includes(query) &&
        !issue.description.toLowerCase().includes(query) &&
        !issue.reportedBy.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Filter by status
    if (statusFilter && issue.status !== statusFilter) {
      return false;
    }

    // Filter by priority
    if (priorityFilter && issue.priority !== priorityFilter) {
      return false;
    }

    // Filter by community
    if (communityFilter && issue.community !== communityFilter) {
      return false;
    }

    return true;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
    setCommunityFilter("");
  };

  // Check if any filter is active
  const isFilterActive =
    searchQuery || statusFilter || priorityFilter || communityFilter;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Issues</h1>
          <p className="text-muted-foreground">
            Manage and resolve reported waste management issues
          </p>
        </div>
        <div className="flex gap-2">
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
              {priorityFilter && (
                <div className="flex items-center gap-1 rounded-full bg-admin-muted px-3 py-1 text-xs">
                  <span>Priority: {priorityFilter}</span>
                  <button onClick={() => setPriorityFilter("")}>
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
                <TableHead>Issue</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{issue.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {issue.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{issue.community}</TableCell>
                    <TableCell>{issue.reportedBy}</TableCell>
                    <TableCell>
                      {new Date(issue.reportedDate).toLocaleDateString()}
                    </TableCell>
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
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          issue.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : issue.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {issue.priority === "High" && (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {issue.priority}
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
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span className="mr-2">🔄</span>
                            <span>Change Status</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span className="mr-2">🔔</span>
                            <span>Send Notification</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <span className="mr-2">🗑️</span>
                            <span>Delete</span>
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
                    No issues found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredIssues.length} of {issuesData.length} issues
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                1
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
