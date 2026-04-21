"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@xerobookz/ui-shared";
import { Shield, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-50 p-6">
      <Card variant="default" className="p-8 max-w-md text-center">
        <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-danger-600" />
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 mb-2">Access Denied</h1>
        <p className="text-grey-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
          <Button
            variant="default"
            onClick={() => router.push("/")}
          >
            <Home size={16} className="mr-2" />
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
