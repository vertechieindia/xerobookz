"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, XeroBookzLogo } from "@xerobookz/ui-shared";
import { Mail, Lock, Shield } from "lucide-react";

export default function SuperAdminAccessPortal() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Call super admin login API
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: "super_admin",
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        localStorage.setItem("xerobookz_token", result.data.access_token);
        localStorage.setItem("xerobookz_refresh_token", result.data.refresh_token);
        localStorage.setItem("xerobookz_user_role", "super_admin");
        router.push("/super-admin/dashboard");
      } else {
        setError(result.error?.details || "Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 p-6">
      <div className="w-full max-w-md">
        <Card variant="default" className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary-100 rounded-full">
                <Shield className="w-12 h-12 text-primary-600" />
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <XeroBookzLogo size="lg" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-800 mb-2">
              Sign in
            </h1>
            <p className="text-grey-600">
              XeroBookz Admin Team Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@xerobookz.com"
              required
              icon={<Mail className="h-4 w-4 text-grey-400" />}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              icon={<Lock className="h-4 w-4 text-grey-400" />}
            />

            {error && (
              <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                <p className="text-danger-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              size="lg"
              variant="gradient"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-grey-500">
              Authorized personnel only. All access is logged and monitored.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
