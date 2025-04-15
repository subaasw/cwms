import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Page Not Found</h1>
        <p className="mb-6 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild className="bg-user-primary hover:bg-user-secondary">
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/user/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
