"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, XeroBookzLogo } from "@xerobookz/ui-shared";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { 
  Users, UserPlus, FileText, Calendar, BarChart3, 
  Settings, Bell, Search, Filter, Plus,
  Mail, Phone, Building2, Clock, CheckCircle2
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  job_title: string;
  department: string;
  status: string;
}

export default function CompanyAdminDashboard() {
  return (
    <AuthGuard requiredRole={["admin", "hrbp", "manager"]}>
      <CompanyAdminDashboardContent />
    </AuthGuard>
  );
}

function CompanyAdminDashboardContent() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // TODO: Fetch from employee-service API
    setEmployees([
      {
        id: "1",
        name: "John Doe",
        email: "john@company.com",
        job_title: "Software Engineer",
        department: "Engineering",
        status: "active",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@company.com",
        job_title: "HR Manager",
        department: "Human Resources",
        status: "active",
      },
    ]);
    setLoading(false);
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-grey-50">
      {/* Header */}
      <nav className="bg-white border-b border-grey-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <XeroBookzLogo size="md" />
              <h1 className="text-xl font-semibold text-secondary-800">Company Admin Dashboard</h1>
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
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">{employees.length}</h3>
            <p className="text-sm text-grey-600">Total Employees</p>
          </Card>

          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent-50 rounded-lg">
                <UserPlus className="w-6 h-6 text-accent-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">0</h3>
            <p className="text-sm text-grey-600">Pending Invitations</p>
          </Card>

          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-warning-50 rounded-lg">
                <FileText className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">12</h3>
            <p className="text-sm text-grey-600">Pending Approvals</p>
          </Card>

          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-info-50 rounded-lg">
                <Calendar className="w-6 h-6 text-info-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">5</h3>
            <p className="text-sm text-grey-600">Upcoming Events</p>
          </Card>
        </div>

        {/* Employees Section */}
        <Card variant="default" className="p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-secondary-800 mb-1">Employees</h2>
              <p className="text-grey-600">Manage your team members</p>
            </div>
            <Button variant="default" size="sm" onClick={() => router.push("/company-admin/employees/invite")}>
              <Plus size={16} className="mr-2" />
              Invite Employee
            </Button>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
          </div>

          {/* Employees Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-grey-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Job Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Department</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-grey-100 hover:bg-grey-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-secondary-800">{employee.name}</div>
                      <div className="text-xs text-grey-500">{employee.email}</div>
                    </td>
                    <td className="py-4 px-4 text-grey-600">{employee.job_title}</td>
                    <td className="py-4 px-4 text-grey-600">{employee.department}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === "active" 
                          ? "bg-accent-50 text-accent-700" 
                          : "bg-grey-100 text-grey-600"
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/company-admin/employees/${employee.id}`)}>
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/company-admin/employees/invite")}>
            <UserPlus className="w-8 h-8 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Invite Employees</h3>
            <p className="text-sm text-grey-600">Send invitations to new team members</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/company-admin/reports")}>
            <BarChart3 className="w-8 h-8 text-accent-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Reports & Analytics</h3>
            <p className="text-sm text-grey-600">View company reports and insights</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/company-admin/contract-team")}>
            <FileText className="w-8 h-8 text-info-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Contract Team</h3>
            <p className="text-sm text-grey-600">Create role and assign users to send/sign MSA, NDA, PO, WO, SOW</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/company-admin/settings")}>
            <Settings className="w-8 h-8 text-warning-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Company Settings</h3>
            <p className="text-sm text-grey-600">Manage company configuration</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
