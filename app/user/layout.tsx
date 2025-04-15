"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Recycle,
  Settings,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AuthProvider, useAuth } from "@/context/UserAuthContext";
import { userAuthService } from "@/utils/userAuth";
import { removeLocalStorage } from "@/utils/localStorage";

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: Home },
  { name: "Schedule Pickup", href: "/user/schedule-pickup", icon: Calendar },
  { name: "Report Issues", href: "/user/report-issues", icon: MessageSquare },
  {
    name: "Pickup History",
    href: "/user/pickup-history",
    icon: ClipboardList,
  },
  { name: "Notifications", href: "/user/notifications", icon: Bell },
];

const UserHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { userData } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await userAuthService.logout();
    removeLocalStorage("user");
    router.push("/login");
  };
  
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center border-b px-4">
              <Link
                href="/user/dashboard"
                className="flex items-center gap-2 font-semibold"
              >
                <Recycle className="h-6 w-6 text-user-primary" />
                <span>CWMS</span>
              </Link>
            </div>
            <nav className="grid gap-1 p-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    pathname === item.href
                      ? "bg-user-muted text-user-primary"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          href="/user/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Recycle className="h-6 w-6 text-user-primary" />
          <span className="font-bold">CWMS</span>
        </Link>

        <nav className="hidden md:flex ml-8 space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-user-primary bg-user-muted/50 rounded-md"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:rounded-md"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative flex items-center gap-2 rounded-full"
              >
                <Avatar>
                  {userData?.profilePicture ? (
                    <AvatarImage src={"/uploads/"+userData.profilePicture} />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-user-muted">
                      <User className="h-4 w-4 text-user-primary" />
                    </div>
                  )}
                </Avatar>

                <span>{userData?.fullName}</span>

                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center gap-2 p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-user-muted">
                  <User className="h-4 w-4 text-user-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{userData?.fullName}</p>
                  <p className="text-xs text-gray-500">{userData?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/user/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user/profile" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button
                  className="flex cursor-pointer w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-user-background">
        <UserHeader />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
