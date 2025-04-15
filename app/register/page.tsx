"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Recycle, Upload, MapPin } from "lucide-react";
import UserAuthService from "@/utils/userAuth";
import { setLocalStorage } from "@/utils/localStorage";
import convertToBase64 from "@/utils/base64Image";

export default function RegisterPage() {
  const userAuth = new UserAuthService();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    community: "",
    address: "",
    profileImage: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationStatus, setLocationStatus] = useState<string>("");
  const [communities, setCommunities] = useState([
    { id: "1", name: "Green Valley" },
    { id: "2", name: "Eco Heights" },
    { id: "3", name: "Sustainable Gardens" },
    { id: "4", name: "Recycling Community" },
    { id: "5", name: "New Community" },
  ]);

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      setLocationStatus("Detecting your location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("Location detected");
        },
        (error) => {
          setLocationStatus(`Error: ${error.message}`);
        }
      );
    } else {
      setLocationStatus("Geolocation is not supported by your browser");
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    }

    if (!formData.community) {
      newErrors.community = "Community is required";
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommunityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, community: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    let base64File;
    if (formData.profileImage) {
      base64File = await convertToBase64(formData.profileImage);
    }

    const {
      fullName,
      password,
      community,
      confirmPassword,
      contactNumber,
      address,
      email,
    } = formData;

    const formSubmissionData = {
      fullName,
      password,
      community,
      confirmPassword,
      contactNumber,
      address,
      email,
      location,
      profileImage: base64File ? base64File : formData.profileImage || "",
    };

    setIsLoading(true);
    const response = await userAuth.register(formSubmissionData);

    if (response?.token) {
      setLocalStorage("user", response.user);
      router.push("/user/dashboard");
    }

    if (response?.message) {
      alert(String(response.message) || "Form Submission Error");
    }
    setIsLoading(false);
  };

  useLayoutEffect(() => {
    const fetchCommunities = async () => {
      const response = await userAuth.getCommunities();

      if (Array.isArray(response) && response.length) {
        const communities = response.map((community) => ({
          id: community?._id,
          name: community.name,
        }));

        setCommunities(communities);
      }
      console.log("communities", response);
    };

    fetchCommunities();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex items-center justify-center">
              <Recycle className="h-10 w-10 text-user-primary" />
            </div>
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your information to create an account
            </p>
          </div>
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    required
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="+60123456789"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={errors.contactNumber ? "border-red-500" : ""}
                />
                {errors.contactNumber && (
                  <p className="text-sm text-red-500">{errors.contactNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="community">Community</Label>
                <Select
                  onValueChange={handleCommunityChange}
                  value={formData.community}
                >
                  <SelectTrigger
                    className={errors.community ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a community" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.community && (
                  <p className="text-sm text-red-500">{errors.community}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Residential Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Green Street"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <MapPin className="h-5 w-5 text-user-primary" />
                  <span className="text-sm">
                    {location
                      ? `Lat: ${location.lat.toFixed(
                          4
                        )}, Lng: ${location.lng.toFixed(4)}`
                      : locationStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative border rounded-md p-2 flex items-center justify-center h-24 cursor-pointer hover:bg-gray-50">
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">
                          Click to upload
                        </span>
                      </div>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="h-24 w-24 rounded-full overflow-hidden border">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button
                className="w-full bg-user-primary hover:bg-user-secondary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link className="font-medium underline" href="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
