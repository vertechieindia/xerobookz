"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@xerobookz/ui-shared";
import { Mail, User, Briefcase, ArrowLeft, Send } from "lucide-react";

export default function InviteEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/employees/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("xerobookz_token")}`,
          "X-Tenant-ID": localStorage.getItem("xerobookz_tenant_id") || "",
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          job_title: formData.jobTitle,
          department: formData.department,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/company-admin/dashboard");
        }, 2000);
      } else {
        setError(result.error?.details || "Failed to send invitation");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-50 p-6">
        <Card variant="default" className="p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-accent-600" />
          </div>
          <h2 className="text-2xl font-semibold text-secondary-800 mb-2">Invitation Sent!</h2>
          <p className="text-grey-600 mb-6">
            An invitation email has been sent to {formData.email}
          </p>
          <Button onClick={() => router.push("/company-admin/dashboard")}>
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
          onClick={() => router.push("/company-admin/dashboard")}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>

        <Card variant="default" className="p-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">Invite Employee</h1>
          <p className="text-grey-600 mb-8">Send an invitation to a new team member</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                required
                icon={<User className="h-4 w-4 text-grey-400" />}
              />
              <Input
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                required
                icon={<User className="h-4 w-4 text-grey-400" />}
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="employee@company.com"
              required
              icon={<Mail className="h-4 w-4 text-grey-400" />}
            />

            <Input
              label="Job Title"
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              placeholder="Software Engineer"
              required
              icon={<Briefcase className="h-4 w-4 text-grey-400" />}
            />

            <Input
              label="Department"
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Engineering"
              required
            />

            {error && (
              <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                <p className="text-danger-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/company-admin/dashboard")}
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
                <Send size={16} className="mr-2" />
                Send Invitation
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
