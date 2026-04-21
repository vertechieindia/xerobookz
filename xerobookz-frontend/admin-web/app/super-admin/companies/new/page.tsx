"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@xerobookz/ui-shared";
import { Building2, Mail, User, Lock, ArrowLeft, Plus } from "lucide-react";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    adminEmail: "",
    adminName: "",
    adminPassword: "",
    plan: "standard",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/super-admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("xerobookz_token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          domain: formData.domain,
          admin_email: formData.adminEmail,
          admin_name: formData.adminName,
          admin_password: formData.adminPassword,
          plan: formData.plan,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/super-admin/dashboard");
        }, 2000);
      } else {
        setError(result.error?.details || "Failed to create company");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create company");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-50 p-6">
        <Card variant="default" className="p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-accent-600" />
          </div>
          <h2 className="text-2xl font-semibold text-secondary-800 mb-2">Company Created!</h2>
          <p className="text-grey-600 mb-6">
            {formData.name} has been successfully created. The admin can now login.
          </p>
          <Button onClick={() => router.push("/super-admin/dashboard")}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/super-admin/dashboard")}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>

        <Card variant="default" className="p-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">Create New Company</h1>
          <p className="text-grey-600 mb-8">Set up a new company account and admin user</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Company Information</h3>
              <div className="space-y-4">
                <Input
                  label="Company Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Acme Corporation"
                  required
                  icon={<Building2 className="h-4 w-4 text-grey-400" />}
                />
                <Input
                  label="Domain (Optional)"
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="acme.com"
                  icon={<Building2 className="h-4 w-4 text-grey-400" />}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Admin Account</h3>
              <div className="space-y-4">
                <Input
                  label="Admin Name"
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  placeholder="John Doe"
                  required
                  icon={<User className="h-4 w-4 text-grey-400" />}
                />
                <Input
                  label="Admin Email"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  placeholder="admin@company.com"
                  required
                  icon={<Mail className="h-4 w-4 text-grey-400" />}
                />
                <Input
                  label="Admin Password"
                  type="password"
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  placeholder="Create a secure password"
                  required
                  icon={<Lock className="h-4 w-4 text-grey-400" />}
                />
                <div>
                  <label className="block text-sm font-medium text-secondary-800 mb-2">Plan</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-4 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                <p className="text-danger-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/super-admin/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={isLoading}
                size="lg"
              >
                <Plus size={16} className="mr-2" />
                Create Company
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
