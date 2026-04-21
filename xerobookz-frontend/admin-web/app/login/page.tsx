"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@xerobookz/api-clients";
import { Button, Input, Card, XeroBookzLogo } from "@xerobookz/ui-shared";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, Building } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authApi.login({
        email,
        password,
        tenant_id: tenantId,
      });

      if (result.success && result.data) {
        // Check if MFA is required
        if (result.data.mfa_required) {
          // Store temporary credentials for MFA verification
          localStorage.setItem("xerobookz_temp_token", result.data.access_token);
          localStorage.setItem("xerobookz_temp_email", email);
          localStorage.setItem("xerobookz_temp_password", password);
          localStorage.setItem("xerobookz_tenant_id", tenantId);
          router.push("/auth/mfa");
          return;
        }

        localStorage.setItem("xerobookz_token", result.data.access_token);
        localStorage.setItem("xerobookz_refresh_token", result.data.refresh_token);
        localStorage.setItem("xerobookz_tenant_id", tenantId);
        localStorage.setItem("xerobookz_user_role", result.data.user_role || "employee");
        setAuth({
          token: result.data.access_token,
          user: { email },
        });
        
        // Route based on role
        const role = result.data.user_role || "employee";
        if (role === "super_admin") {
          router.push("/super-admin/dashboard");
        } else if (role === "contract_manager") {
          router.push("/contract-team/dashboard");
        } else if (role === "admin" || role === "hrbp") {
          router.push("/company-admin/dashboard");
        } else {
          router.push("/employee/dashboard");
        }
      } else {
        setError(result.error?.details || "Login failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      const isNetwork = /network|fetch|failed|ECONNREFUSED/i.test(msg);
      setError(
        isNetwork
          ? "Cannot reach server. Ensure the API is running (./start-api.sh) and try again."
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-grey-600 hover:text-secondary-800 mb-6"
          >
            ← Back to Home
          </Button>
        </div>
        <div className="mb-4 text-center">
          <p className="text-sm text-grey-600 mb-2">
            New to XeroBookz?{" "}
            <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Create an account
            </Link>
          </p>
        </div>
        <Card variant="default" className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <XeroBookzLogo size="xl" />
            </div>
            <h1 className="text-2xl font-semibold text-secondary-800 mb-2">
              Admin Portal
            </h1>
            <p className="text-grey-600 text-sm">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
            <Input
              label="Tenant ID or Code"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="e.g. XB000016272 or your tenant UUID"
              required
              icon={<Building className="h-4 w-4 text-grey-400" />}
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
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-grey-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
