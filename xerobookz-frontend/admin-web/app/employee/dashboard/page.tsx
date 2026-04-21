"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, XeroBookzLogo } from "@xerobookz/ui-shared";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { 
  User, FileText, Clock, Calendar, Bell,
  Settings, LogOut, CheckCircle2, AlertCircle
} from "lucide-react";

interface PersonalInfo {
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  employeeId: string;
}

export default function EmployeeDashboard() {
  return (
    <AuthGuard requiredRole={["employee", "admin", "hrbp", "manager"]}>
      <EmployeeDashboardContent />
    </AuthGuard>
  );
}

function EmployeeDashboardContent() {
  const router = useRouter();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from employee-service API
    setPersonalInfo({
      name: "John Doe",
      email: "john@company.com",
      jobTitle: "Software Engineer",
      department: "Engineering",
      employeeId: "EMP-001",
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-grey-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-50">
      {/* Header */}
      <nav className="bg-white border-b border-grey-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <XeroBookzLogo size="md" />
              <h1 className="text-xl font-semibold text-secondary-800">Employee Portal</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell size={16} className="mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm">
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card variant="default" className="p-6 mb-8 bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-secondary-800 mb-2">
                Welcome back, {personalInfo?.name}!
              </h2>
              <p className="text-grey-600">
                {personalInfo?.jobTitle} • {personalInfo?.department}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <User className="w-12 h-12 text-primary-600" />
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">40h</h3>
            <p className="text-sm text-grey-600">This Week</p>
          </Card>

          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent-50 rounded-lg">
                <Calendar className="w-6 h-6 text-accent-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">15</h3>
            <p className="text-sm text-grey-600">Days Remaining</p>
          </Card>

          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-warning-50 rounded-lg">
                <FileText className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">3</h3>
            <p className="text-sm text-grey-600">Pending Documents</p>
          </Card>

          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-info-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-info-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">12</h3>
            <p className="text-sm text-grey-600">Completed Tasks</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/employee/timesheets")}>
            <Clock className="w-8 h-8 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Timesheets</h3>
            <p className="text-sm text-grey-600">Submit and track your work hours</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/employee/leave")}>
            <Calendar className="w-8 h-8 text-accent-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Leave Requests</h3>
            <p className="text-sm text-grey-600">Request time off and view balance</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/employee/documents")}>
            <FileText className="w-8 h-8 text-warning-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Documents</h3>
            <p className="text-sm text-grey-600">Access your personal documents</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/employee/profile")}>
            <User className="w-8 h-8 text-info-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">My Profile</h3>
            <p className="text-sm text-grey-600">Update your personal information</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/employee/benefits")}>
            <CheckCircle2 className="w-8 h-8 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Benefits</h3>
            <p className="text-sm text-grey-600">View and manage your benefits</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/employee/payroll")}>
            <FileText className="w-8 h-8 text-accent-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Payroll</h3>
            <p className="text-sm text-grey-600">View payslips and tax documents</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card variant="default" className="p-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-grey-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-800">Timesheet submitted</p>
                <p className="text-xs text-grey-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-grey-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-800">Leave request pending approval</p>
                <p className="text-xs text-grey-500">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
