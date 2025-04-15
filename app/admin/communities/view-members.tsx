"use client"

import { useState } from "react"
import { Search, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample members data
const membersSampleData = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+60 12-345-6789",
    address: "123 Green St, Green Valley",
    joinDate: "2023-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+60 12-987-6543",
    address: "456 Green St, Green Valley",
    joinDate: "2023-02-20",
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+60 13-456-7890",
    address: "789 Green St, Green Valley",
    joinDate: "2023-03-10",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+60 14-567-8901",
    address: "101 Green St, Green Valley",
    joinDate: "2023-04-05",
    status: "Active",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.b@example.com",
    phone: "+60 15-678-9012",
    address: "202 Green St, Green Valley",
    joinDate: "2023-05-12",
    status: "Active",
  },
]

interface ViewMembersModalProps {
  communityName: string
  isOpen: boolean
  onClose: () => void
}

export function ViewMembersModal({ communityName, isOpen, onClose }: ViewMembersModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [members] = useState(membersSampleData)

  // Filter members based on search query
  const filteredMembers = members.filter((member) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.phone.includes(query) ||
      member.status.toLowerCase().includes(query)
    )
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Members of {communityName}</DialogTitle>
          <DialogDescription>View and manage all members registered in this community</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-4 my-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-admin-primary hover:bg-admin-secondary">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        <div className="overflow-auto flex-1 -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{member.email}</p>
                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={member.address}>
                      {member.address}
                    </TableCell>
                    <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          member.status === "Active"
                            ? "border-green-200 bg-green-100 text-green-800"
                            : "border-yellow-200 bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center pt-4 border-t mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {members.length} members
          </p>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
