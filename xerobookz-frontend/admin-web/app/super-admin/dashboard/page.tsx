"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, XeroBookzLogo } from "@xerobookz/ui-shared";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { 
  Building2, Users, Key, BarChart3, TrendingUp, 
  Plus, Search, Filter, Download, Settings,
  Shield, Activity, Database, Globe
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  domain: string;
  is_active: boolean;
  total_users: number;
  total_employees: number;
  created_at: string;
}

interface Statistics {
  total_tenants: number;
  active_tenants: number;
  total_users: number;
  active_users: number;
  total_employees: number;
  total_organizations: number;
}

export default function SuperAdminDashboard() {
  return (
    <AuthGuard requiredRole="super_admin">
      <SuperAdminDashboardContent />
    </AuthGuard>
  );
}

function SuperAdminDashboardContent() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // TODO: Fetch from super-admin-service API
    // For now, using mock data
    setStatistics({
      total_tenants: 45,
      active_tenants: 42,
      total_users: 1234,
      active_users: 1180,
      total_employees: 5678,
      total_organizations: 45,
    });
    
    setCompanies([
      {
        id: "1",
        name: "Acme Corporation",
        domain: "acme.com",
        is_active: true,
        total_users: 150,
        total_employees: 500,
        created_at: "2024-01-15",
      },
      {
        id: "2",
        name: "TechStart Inc",
        domain: "techstart.io",
        is_active: true,
        total_users: 75,
        total_employees: 200,
        created_at: "2024-02-20",
      },
    ]);
    
    setLoading(false);
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-grey-50">
      {/* Header */}
      <nav className="bg-white border-b border-grey-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <XeroBookzLogo size="md" />
              <h1 className="text-xl font-semibold text-secondary-800">Platform Admin</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Building2 className="w-6 h-6 text-primary-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">
              {statistics?.total_tenants || 0}
            </h3>
            <p className="text-sm text-grey-600">Total Companies</p>
            <p className="text-xs text-primary-600 mt-2">
              {statistics?.active_tenants || 0} active
            </p>
          </Card>

          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent-50 rounded-lg">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-accent-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">
              {statistics?.total_users || 0}
            </h3>
            <p className="text-sm text-grey-600">Total Users</p>
            <p className="text-xs text-accent-600 mt-2">
              {statistics?.active_users || 0} active
            </p>
          </Card>

          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary-50 rounded-lg">
                <Users className="w-6 h-6 text-secondary-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-secondary-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">
              {statistics?.total_employees || 0}
            </h3>
            <p className="text-sm text-grey-600">Total Employees</p>
          </Card>

          <Card variant="floating" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-warning-50 rounded-lg">
                <Database className="w-6 h-6 text-warning-600" />
              </div>
              <Activity className="w-5 h-5 text-warning-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-1">
              {statistics?.total_organizations || 0}
            </h3>
            <p className="text-sm text-grey-600">Organizations</p>
          </Card>
        </div>

        {/* Companies Section */}
        <Card variant="default" className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-secondary-800 mb-1">Companies</h2>
              <p className="text-grey-600">Manage all companies and tenants</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Button variant="default" size="sm" onClick={() => router.push("/super-admin/companies/new")}>
                <Plus size={16} className="mr-2" />
                Add Company
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies..."
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

          {/* Companies Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-grey-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Domain</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Users</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Employees</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-b border-grey-100 hover:bg-grey-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-secondary-800">{company.name}</div>
                      <div className="text-xs text-grey-500">Created {new Date(company.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-4 text-grey-600">{company.domain}</td>
                    <td className="py-4 px-4 text-grey-600">{company.total_users}</td>
                    <td className="py-4 px-4 text-grey-600">{company.total_employees}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.is_active 
                          ? "bg-accent-50 text-accent-700" 
                          : "bg-grey-100 text-grey-600"
                      }`}>
                        {company.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/super-admin/companies/${company.id}`)}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/super-admin/api-keys?tenant=${company.id}`)}>
                          <Key size={14} className="mr-1" />
                          API Keys
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/super-admin/statistics")}>
            <BarChart3 className="w-8 h-8 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Statistics & Reports</h3>
            <p className="text-sm text-grey-600">View detailed analytics and system reports</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/super-admin/api-keys")}>
            <Key className="w-8 h-8 text-accent-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">API Key Management</h3>
            <p className="text-sm text-grey-600">Create and manage API keys for companies</p>
          </Card>

          <Card variant="floating" className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/super-admin/system-health")}>
            <Activity className="w-8 h-8 text-warning-600 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">System Health</h3>
            <p className="text-sm text-grey-600">Monitor system status and performance</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
