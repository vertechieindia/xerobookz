"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@xerobookz/ui-shared";
import { Shield, Smartphone, Key } from "lucide-react";

export default function MFAPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const tempToken = localStorage.getItem("xerobookz_temp_token") || localStorage.getItem("xerobookz_token");
      const tenantId = localStorage.getItem("xerobookz_tenant_id");
      
      // Get user ID from token (decode JWT)
      let userId = null;
      if (tempToken) {
        try {
          const payload = JSON.parse(atob(tempToken.split('.')[1]));
          userId = payload.sub;
        } catch (e) {
          console.error("Failed to decode token", e);
        }
      }
      
      const response = await fetch("/api/v1/mfa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempToken}`,
          "X-User-ID": userId || "",
          "X-Tenant-ID": tenantId || "",
        },
        body: JSON.stringify({
          code: useBackup ? undefined : code,
          backup_code: useBackup ? backupCode : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // MFA verified, now complete login
        const loginResponse = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: localStorage.getItem("xerobookz_temp_email"),
            password: localStorage.getItem("xerobookz_temp_password"),
            tenant_id: tenantId,
            mfa_code: useBackup ? backupCode : code,
          }),
        });

        const loginResult = await loginResponse.json();
        
        if (loginResult.success) {
          localStorage.setItem("xerobookz_token", loginResult.data.access_token);
          localStorage.setItem("xerobookz_refresh_token", loginResult.data.refresh_token);
          localStorage.removeItem("xerobookz_temp_token");
          localStorage.removeItem("xerobookz_temp_email");
          localStorage.removeItem("xerobookz_temp_password");
          
          // Route based on role
          const role = loginResult.data.user_role || "employee";
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
          setError(loginResult.error?.details || "Login failed after MFA");
        }
      } else {
        setError(result.error?.details || "Invalid code");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-50 p-6">
      <Card variant="default" className="p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-800 mb-2">Two-Factor Authentication</h1>
          <p className="text-grey-600">
            Enter the code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          {!useBackup ? (
            <>
              <Input
                label="Authentication Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                required
                maxLength={6}
                icon={<Smartphone className="h-4 w-4 text-grey-400" />}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUseBackup(true)}
                className="w-full"
              >
                Use backup code instead
              </Button>
            </>
          ) : (
            <>
              <Input
                label="Backup Code"
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX"
                required
                icon={<Key className="h-4 w-4 text-grey-400" />}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUseBackup(false)}
                className="w-full"
              >
                Use authenticator app instead
              </Button>
            </>
          )}

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
            Verify
          </Button>
        </form>
      </Card>
    </div>
  );
}
