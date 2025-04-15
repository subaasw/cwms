"use client";

import type React from "react";
import { useState } from "react";
import { Check, Clock, X } from "lucide-react";
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

interface AddCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (communityData: any) => void;
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

export function AddCommunityModal({
  isOpen,
  onClose,
  onAdd,
}: AddCommunityModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    pickupDays: "",
    pickupTimes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    let currentDays = formData.pickupDays
      ? formData.pickupDays.split(", ")
      : [];

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
      .filter((d) =>
        currentDays.some(
          (cd) => cd.toLowerCase() === d.id.toLowerCase() || cd === d.label
        )
      )
      .map((d) => d.label);

    setFormData((prev) => ({ ...prev, pickupDays: orderedDays.join(", ") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newCommunity = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        members: 0,
        pickupDays: formData.pickupDays || "Not scheduled",
        pickupTimes: formData.pickupTimes || "Not scheduled",
        status: "Active",
      };

      onAdd(newCommunity);

      onClose();
      setFormData({
        name: "",
        description: "",
        address: "",
        pickupDays: "",
        pickupTimes: "",
      });
    } catch (error) {
      console.error("Error adding community:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDays = formData.pickupDays
    ? formData.pickupDays.toLowerCase().split(", ")
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Community</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Community Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter community name"
                required
              />
            </div>

            <div className="grid gap-2 mb-3">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the community"
                className="min-h-[100px] resize-none"
                required
              />
            </div>

            <div className="grid gap-2 mb-4">
              <Label className="mb-2 block">Pickup Days</Label>
              <div className="flex flex-wrap gap-4">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.id}`}
                      checked={
                        selectedDays.includes(day.id) ||
                        selectedDays.includes(day.label.toLowerCase())
                      }
                      onCheckedChange={(checked) =>
                        handleDayToggle(day.id, checked === true)
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

            <div className="grid gap-2">
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
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Full address of the community"
                className="min-h-[80px] resize-none"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-admin-primary hover:bg-admin-secondary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Adding...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Add Community
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
