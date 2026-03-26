import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-agrogenix-50 to-agrogenix-100 p-4 text-center">
      <div className="mb-4">
        <Logo size="lg" />
      </div>
      <h1 className="text-4xl font-bold text-agrogenix-800 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-agrogenix-700 mb-4">Page Not Found</h2>
      <p className="max-w-md mb-8 text-agrogenix-600">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button asChild className="bg-agrogenix-600 hover:bg-agrogenix-700 text-white">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
