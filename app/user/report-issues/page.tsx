"use client";

import type React from "react";

import { useState } from "react";
import { Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { userAuthService } from "@/utils/userAuth";
import convertToBase64 from "@/utils/base64Image";

const issueTypes = [
  { id: "missed_pickup", label: "Missed Pickup" },
  { id: "service_complaint", label: "Service Complaint" },
  { id: "illegal_dumping", label: "Illegal Dumping" },
  { id: "equipment_damage", label: "Damaged Equipment" },
  { id: "other", label: "Other" },
];

export default function ReportIssuesPage() {
  const [formData, setFormData] = useState({
    issueType: "",
    location: "",
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reportId, setReportId] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.issueType) {
      newErrors.issueType = "Please select an issue type";
    }

    if (!formData.location) {
      newErrors.location = "Please enter the location";
    }

    if (!formData.description) {
      newErrors.description = "Please provide a description";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...fileArray]);

      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreview((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    URL.revokeObjectURL(imagePreview[index]);
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const { issueType, location, description } = formData;

    const base64ImageArray = await Promise.all(
      images.map((image) => convertToBase64(image))
    );

    const response = await userAuthService.postReportIssue({
      issueType,
      address: location,
      description,
      photos: base64ImageArray,
    });

    if (response?.report?._id) {
      setReportId(response.report._id);
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    setFormData({
      issueType: "",
      location: "",
      description: "",
    });
    setImages([]);
    setImagePreview([]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-muted-foreground">
          Report waste management issues such as missed pickups or overflowing
          bins
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
                Issue Reported Successfully
              </h2>
              <p className="text-muted-foreground">
                Your issue has been reported. We'll look into it as soon as
                possible.
              </p>
              <p className="text-sm font-medium text-user-primary">
                Issue ID: {reportId}
              </p>
              <Button
                className="mt-4 bg-user-primary hover:bg-user-secondary"
                onClick={() => setIsSuccess(false)}
              >
                Report Another Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type</Label>
                <Select
                  value={formData.issueType}
                  onValueChange={(value) =>
                    handleSelectChange("issueType", value)
                  }
                >
                  <SelectTrigger
                    id="issueType"
                    className={errors.issueType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select an issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.issueType && (
                  <p className="text-sm text-red-500">{errors.issueType}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter the location of the issue"
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide details about the issue"
                  value={formData.description}
                  onChange={handleChange}
                  className={`min-h-[120px] ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Image upload */}
              <div className="space-y-2">
                <Label>Photos (Optional)</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {/* Image previews */}
                  {imagePreview.map((preview, index) => (
                    <div
                      key={index}
                      className="relative rounded-md overflow-hidden border h-32"
                    >
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Issue preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}

                  <div className="border relative border-dashed rounded-md flex items-center justify-center h-32 cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-sm text-gray-500">
                        Upload photos
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  You can upload up to 5 photos to help us understand the issue
                  better.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-user-primary hover:bg-user-secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
