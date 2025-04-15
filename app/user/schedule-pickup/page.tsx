"use client";

import type React from "react";

import { useState } from "react";
import {
  CalendarIcon,
  Check,
  Trash2,
  Recycle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import UserAuthService, { userAuthService } from "@/utils/userAuth";

// Sample available time slots
const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

// Sample waste types
const wasteTypes = [
  {
    id: "household",
    label: "Household Waste",
    description:
      "General household waste including food scraps and non-recyclables",
    icon: Trash2,
  },
  {
    id: "recyclable",
    label: "Recyclable Waste",
    description: "Paper, plastic, glass, and metal items that can be recycled",
    icon: Recycle,
  },
  {
    id: "hazardous",
    label: "Hazardous Waste",
    description:
      "Batteries, electronics, chemicals, and other hazardous materials",
    icon: AlertTriangle,
  },
];

export default function SchedulePickupPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [selectedWasteType, setSelectedWasteType] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!date) {
      newErrors.date = "Please select a date";
    }

    if (!timeSlot) {
      newErrors.timeSlot = "Please select a time slot";
    }

    if (!selectedWasteType) {
      newErrors.wasteType = "Please select a waste type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const response = await userAuthService.pickupRequest({
      pickupDate: date,
      pickupTime: timeSlot,
      wasteType: selectedWasteType,
      notes: additionalNotes,
    });

    if (response?.request?._id) {
      setIsSubmitting(false);

      setDate(undefined);
      setTimeSlot("");
      setSelectedWasteType("");
      setAdditionalNotes("");
      setIsSuccess(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Schedule Waste Pickup
        </h1>
        <p className="text-muted-foreground">
          Select a date, time, and waste type to schedule a pickup
        </p>
      </div>

      {isSuccess ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">
                Pickup Scheduled Successfully
              </h2>
              <p className="text-muted-foreground">
                Your waste pickup has been scheduled for{" "}
                {date && format(date, "EEEE, MMMM do, yyyy")} at {timeSlot}.
              </p>
              <Button
                className="mt-4 bg-user-primary hover:bg-user-secondary"
                onClick={() => setIsSuccess(false)}
              >
                Schedule Another Pickup
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader></CardHeader>
            <CardContent className="space-y-6">
              {/* Date selection */}
              <div className="space-y-2">
                <Label htmlFor="date">Pickup Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !date && "text-muted-foreground"
                      } ${errors.date ? "border-red-500" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => {
                        // Disable past dates and Sundays
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || date.getDay() === 0;
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date}</p>
                )}
              </div>

              {/* Time slot selection */}
              <div className="space-y-2">
                <Label htmlFor="timeSlot">Pickup Time</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger
                    id="timeSlot"
                    className={errors.timeSlot ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timeSlot && (
                  <p className="text-sm text-red-500">{errors.timeSlot}</p>
                )}
              </div>

              {/* Waste type selection */}
              <div className="space-y-3">
                <Label htmlFor="wasteType">Waste Type</Label>
                <RadioGroup
                  value={selectedWasteType}
                  onValueChange={setSelectedWasteType}
                  className="space-y-3"
                >
                  {wasteTypes.map((type) => (
                    <div key={type.id} className="flex">
                      <RadioGroupItem
                        value={type.id}
                        id={type.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={type.id}
                        className={`flex flex-1 cursor-pointer items-start space-x-4 rounded-md border p-4 hover:bg-muted peer-data-[state=checked]:border-user-primary peer-data-[state=checked]:bg-user-muted ${
                          errors.wasteType && !selectedWasteType
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <type.icon className="h-5 w-5 text-user-primary" />
                        <div className="space-y-1">
                          <p className="font-medium leading-none">
                            {type.label}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.wasteType && (
                  <p className="text-sm text-red-500">{errors.wasteType}</p>
                )}
              </div>

              {/* Additional notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions or details about your waste pickup"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-user-primary hover:bg-user-secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Pickup"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
