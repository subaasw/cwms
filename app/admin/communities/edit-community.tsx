"use client";

import type React from "react";

import { useState } from "react";
import { Clock, MapPin, Save, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Community {
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
}

interface EditCommunityModalProps {
  community: Community;
  isOpen: boolean;
  onClose: () => void;
}

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export function EditCommunityModal({
  community,
  isOpen,
  onClose,
}: EditCommunityModalProps) {
  const [formData, setFormData] = useState<Community>({ ...community });
  const [isSaving, setIsSaving] = useState(false);

  const selectedDays = formData.pickupDays.toLowerCase().split(", ");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    let currentDays = formData.pickupDays.split(", ");

    if (checked) {
      if (!currentDays.includes(day)) {
        currentDays.push(day);
      }
    } else {
      currentDays = currentDays.filter(
        (d) => d.toLowerCase() !== day.toLowerCase()
      );
    }

    const orderedDays = daysOfWeek
      .filter((d) => currentDays.some((cd) => cd.toLowerCase() === d.id))
      .map((d) => d.label);

    setFormData((prev) => ({ ...prev, pickupDays: orderedDays.join(", ") }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Community</DialogTitle>
          <DialogDescription>
            Update the details and settings for this community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  name="address"
                  className="pl-10"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Brief description of the community"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  className="pl-10"
                  value={formData.createdBy || ""}
                  onChange={handleInputChange}
                  placeholder="Community representative"
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone || ""}
                onChange={handleInputChange}
                placeholder="+60 12-345-6789"
              />
            </div> */}

            {/* <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail || ""}
                onChange={handleInputChange}
                placeholder="contact@example.com"
              />
            </div> */}

            <div className="space-y-4 md:col-span-2">
              <div>
                <Label className="mb-2 block">Pickup Days</Label>
                <div className="flex flex-wrap gap-4">
                  {daysOfWeek.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.id}`}
                        checked={selectedDays.includes(day.id)}
                        onCheckedChange={(checked) =>
                          handleDayToggle(day.label, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`day-${day.id}`}
                        className="text-sm font-normal"
                      >
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupTimes">Pickup Times</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pickupTimes"
                  name="pickupTimes"
                  className="pl-10"
                  value={formData.pickupTimes}
                  onChange={handleInputChange}
                  placeholder="e.g. 9:00 AM - 11:00 AM"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-admin-primary hover:bg-admin-secondary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
