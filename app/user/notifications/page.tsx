"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  File,
  MessageSquare,
  Recycle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userAuthService } from "@/utils/userAuth";

const notificationsData = [
  {
    id: "1",
    title: "Pickup Scheduled",
    message: "Your waste pickup is scheduled for tomorrow at 9:00 AM.",
    date: "2024-04-14",
    time: "10:30 AM",
    type: "pickup",
    read: false,
  },
  {
    id: "2",
    title: "Issue Resolved",
    message: "Your reported issue #1234 has been resolved.",
    date: "2024-04-13",
    time: "02:45 PM",
    type: "issue",
    read: false,
  },
  {
    id: "3",
    title: "Community Update",
    message: "New recycling guidelines have been posted for your community.",
    date: "2024-04-11",
    time: "09:15 AM",
    type: "community",
    read: true,
  },
  {
    id: "4",
    title: "Pickup Completed",
    message: "Your scheduled waste pickup has been completed successfully.",
    date: "2024-04-10",
    time: "11:20 AM",
    type: "pickup",
    read: true,
  },
  {
    id: "5",
    title: "Issue Update",
    message: "Your reported issue #1122 is now being processed.",
    date: "2024-04-08",
    time: "03:30 PM",
    type: "issue",
    read: true,
  },
  {
    id: "6",
    title: "Reminder",
    message: "Don't forget to schedule your waste pickup for next week.",
    date: "2024-04-07",
    time: "08:00 AM",
    type: "reminder",
    read: true,
  },
  {
    id: "7",
    title: "Community Event",
    message: "Join us for a community cleanup event this Saturday at 10:00 AM.",
    date: "2024-04-05",
    time: "01:15 PM",
    type: "community",
    read: true,
  },
  {
    id: "8",
    title: "Hazardous Waste Collection",
    message: "Special hazardous waste collection scheduled for next Monday.",
    date: "2024-04-03",
    time: "09:45 AM",
    type: "pickup",
    read: true,
  },
];

type NotificationProps = {
  _id: string;
  communityId: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  message: string;
  type: string;
  metadata: {
    reportId: string;
    userId: string;
    priority: string | null;
  };
  read: string[];
  recipients: string[];
};

const getNotificationIcon = (type: string, read: boolean) => {
  const iconClass = read ? "text-gray-400" : "text-user-primary";

  switch (type) {
    case "NEW_PICKUP_REQUEST":
      return <Calendar className={`h-5 w-5 ${iconClass}`} />;
    case "NEW_REPORT":
      return <File className={`h-5 w-5 ${iconClass}`} />;
    case "community":
      return <Recycle className={`h-5 w-5 ${iconClass}`} />;
    case "reminder":
      return <Bell className={`h-5 w-5 ${iconClass}`} />;
    default:
      return <Bell className={`h-5 w-5 ${iconClass}`} />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationProps[] | []>(
    []
  );

  const markAllAsRead = () => {
    console.log("Marking all notifications as read");
  };

  const clearAllNotifications = () => {
    console.log("Clearing all notifications");
  };

  useEffect(() => {
    const fetchPickupHistory = async () => {
      const notifications: NotificationProps[] =
        await userAuthService.getNotifications();
      setNotifications(notifications);
    };

    fetchPickupHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your waste management activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
          <Button variant="outline" onClick={clearAllNotifications}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3"></CardHeader>
        <CardContent className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  notification.type === "NEW_REPORT"
                    ? "bg-user-muted/30 border-user-primary/20"
                    : ""
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    notification.type === "NEW_REPORT" ? "bg-user-muted" : "bg-gray-100"
                  }`}
                >
                  {getNotificationIcon(
                    notification.type,
                    notification.type !== "NEW_REPORT"
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className={`font-medium ${
                          notification.type === "NEW_REPORT" ? "text-user-primary" : ""
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                      {new Date(notification.createdAt).toTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No notifications</h3>
              <p className="text-sm text-gray-500">
                You don't have any notifications in this category.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
