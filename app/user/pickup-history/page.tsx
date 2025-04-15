"use client";

import { useEffect, useState } from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Recycle,
  Search,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { format } from "date-fns";
import { userAuthService } from "@/utils/userAuth";

type PickupRequest = {
  _id: string;
  communityId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  wasteType: string;
  status: string;
  pickupDate: string;
  pickupTime: string;
  notes: string;
};

const getWasteTypeIcon = (type: string) => {
  switch (type) {
    case "household":
      return <Trash2 className="h-4 w-4 text-user-primary" />;
    case "recyclable":
      return <Recycle className="h-4 w-4 text-green-600" />;
    case "hazardous":
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    default:
      return <Trash2 className="h-4 w-4 text-user-primary" />;
  }
};

export default function PickupHistoryPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pickupHistory, setPickupHistory] = useState<PickupRequest[] | []>([]);

  const filteredPickupHistory = pickupHistory.filter((pickup) => {
    if (dateRange.from && dateRange.to) {
      const pickupDate = new Date(pickup.pickupDate);
      if (pickupDate < dateRange.from || pickupDate > dateRange.to) {
        return false;
      }
    }

    if (wasteTypeFilter && pickup.wasteType !== wasteTypeFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        pickup.wasteType.toLowerCase().includes(query) ||
        pickup.pickupDate.includes(query)
      );
    }

    return true;
  });

  useEffect(() => {
    const fetchPickupHistory = async () => {
      const pickupHistory: PickupRequest[] =
        await userAuthService.pickupHistory();
      setPickupHistory(pickupHistory);
    };

    fetchPickupHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pickup History</h1>
          <p className="text-muted-foreground">
            View your past waste pickups and recycling statistics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Waste Type</Label>
                <Select
                  value={wasteTypeFilter}
                  onValueChange={setWasteTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
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

              <div className="space-y-2 md:col-span-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by type, date, or weight"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(pickupHistory) && pickupHistory.length > 0 ? (
                  pickupHistory.map((pickup) => (
                    <TableRow key={pickup._id}>
                      <TableCell>{pickup._id}</TableCell>
                      <TableCell>
                        {format(new Date(pickup.pickupDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{pickup.pickupTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getWasteTypeIcon(pickup.wasteType)}
                          <span>{pickup.wasteType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          {pickup.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No pickup history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {pickupHistory.length} of {pickupHistory.length} entries
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
    </div>
  );
}
