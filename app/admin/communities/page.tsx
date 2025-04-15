"use client";

import { useLayoutEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewMembersModal } from "./view-members";
import { EditCommunityModal } from "./edit-community";
import { AddCommunityModal } from "./add-community";
import { adminAuthService } from "@/utils/adminAuth";

type CommunityProps = {
  _id: string;
  name: string;
  address: string;
  description: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  location: {
    lat: number;
    lng: number;
  } | null;
  members: string[];
  pickupDays: string;
  pickupTimes: string;
};

export default function CommunitiesPage() {
  const [viewMembersOpen, setViewMembersOpen] = useState(false);
  const [editCommunityOpen, setEditCommunityOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] =
    useState<CommunityProps | null>(null);
  const [communities, setCommunities] = useState<CommunityProps[] | null>(null);
  const [addCommunityOpen, setAddCommunityOpen] = useState(false);

  const handleAddCommunity = async (newCommunity: any) => {
    const res = await adminAuthService.addNewCommunity(newCommunity);
    setCommunities((prev: any) => [...prev, res]);
  };

  useLayoutEffect(() => {
    const fetchAllCommunities = async () => {
      const communities: CommunityProps[] =
        await adminAuthService.fetchCommunities();
      if (Array.isArray(communities)) {
        setCommunities(communities);
      }
    };

    fetchAllCommunities();
  }, []);

  if (!communities) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Communities</h1>
          <p className="text-muted-foreground">
            Manage all registered communities and their waste collection
            schedules
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setAddCommunityOpen(true)}
            className="bg-admin-primary hover:bg-admin-secondary"
          >
            <Plus className="h-4 w-4" />
            Add Community
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3"></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Pickup Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communities.length > 0 ? (
                communities.map((community) => (
                  <TableRow key={community._id || community.createdAt}>
                    <TableCell className="font-medium">
                      {community.name}
                    </TableCell>
                    <TableCell>{community.address}</TableCell>
                    <TableCell>{community.members?.length || 0}</TableCell>
                    <TableCell>
                      <div>
                        <p>{community.pickupDays}</p>
                        <p className="text-xs text-muted-foreground">
                          {community.pickupTimes}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          community.active
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {community.active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCommunity(community);
                              setViewMembersOpen(true);
                            }}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            <span>View Members</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCommunity(community);
                              setEditCommunityOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
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
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No communities found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {communities.length} of {communities.length} communities
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

      {/* View Members Modal */}
      {selectedCommunity && (
        <ViewMembersModal
          communityName={selectedCommunity.name}
          isOpen={viewMembersOpen}
          onClose={() => setViewMembersOpen(false)}
        />
      )}

      {/* Edit Community Modal */}
      {selectedCommunity && (
        <EditCommunityModal
          community={selectedCommunity}
          isOpen={editCommunityOpen}
          onClose={() => setEditCommunityOpen(false)}
        />
      )}

      <AddCommunityModal
        isOpen={addCommunityOpen}
        onClose={() => setAddCommunityOpen(false)}
        onAdd={handleAddCommunity}
      />
    </div>
  );
}
