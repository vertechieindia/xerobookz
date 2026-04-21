"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@xerobookz/ui-shared";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { FileText, ArrowLeft, UserPlus, Check, Loader2 } from "lucide-react";

const API_BASE = typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_API_URL || "";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface TenantUser {
  user_id: string;
  email: string;
  role_names: string[];
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("xerobookz_token") : null;
  const tenant = typeof window !== "undefined" ? localStorage.getItem("xerobookz_tenant_id") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(tenant && { "X-Tenant-ID": tenant }),
  };
}

export default function ContractTeamManagementPage() {
  return (
    <AuthGuard requiredRole={["admin", "hrbp", "manager"]}>
      <ContractTeamManagementContent />
    </AuthGuard>
  );
}

function ContractTeamManagementContent() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingRole, setCreatingRole] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const contractManagerRole = roles.find((r) => r.name === "contract_manager" || r.name === "Contract Manager");

  const fetchRoles = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/v1/auth/roles`, { headers: getAuthHeaders() });
      const data = await r.json();
      if (data.data) setRoles(Array.isArray(data.data) ? data.data : []);
    } catch {
      setRoles([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/v1/auth/tenant-users`, { headers: getAuthHeaders() });
      const data = await r.json();
      if (data.data) setUsers(Array.isArray(data.data) ? data.data : []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchRoles(), fetchUsers()]);
      setLoading(false);
    })();
  }, []);

  const createContractManagerRole = async () => {
    setCreatingRole(true);
    setMessage(null);
    try {
      const r = await fetch(`${API_BASE}/api/v1/auth/roles`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: "contract_manager",
          description: "Contract Team: create, send, and sign MSA, NDA, PO, WO, SOW documents",
        }),
      });
      const data = await r.json();
      if (data.success) {
        setMessage({ type: "success", text: "Contract Team role created." });
        await fetchRoles();
      } else {
        setMessage({ type: "error", text: data.error?.details || "Failed to create role." });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to create role." });
    } finally {
      setCreatingRole(false);
    }
  };

  const assignContractManager = async (userId: string) => {
    if (!contractManagerRole) {
      setMessage({ type: "error", text: "Create the Contract Team role first." });
      return;
    }
    setAssigning(userId);
    setMessage(null);
    try {
      const r = await fetch(`${API_BASE}/api/v1/auth/assign-role`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ user_id: userId, role_id: contractManagerRole.id }),
      });
      const data = await r.json();
      if (data.success) {
        setMessage({ type: "success", text: "Role assigned." });
        await fetchUsers();
      } else {
        setMessage({ type: "error", text: data.error?.details || "Failed to assign role." });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to assign role." });
    } finally {
      setAssigning(null);
    }
  };

  const hasContractManager = (u: TenantUser) =>
    u.role_names.some((r) => r.toLowerCase() === "contract_manager" || r.toLowerCase() === "admin");

  return (
    <div className="min-h-screen bg-grey-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => router.push("/company-admin/dashboard")} className="mb-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>

        <Card variant="default" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary-50 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-secondary-800">Contract Team</h1>
              <p className="text-grey-600">Create the Contract Team role and assign it to users who can send and sign MSA, NDA, PO, WO, SOW, etc.</p>
            </div>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg ${message.type === "success" ? "bg-accent-50 text-accent-800" : "bg-red-50 text-red-800"}`}
            >
              {message.text}
            </div>
          )}

          {/* Role setup */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-secondary-800 mb-2">Contract Team role</h2>
            {contractManagerRole ? (
              <p className="text-sm text-grey-600">
                Role <strong>{contractManagerRole.name}</strong> exists. Assign it to users below.
              </p>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  onClick={createContractManagerRole}
                  disabled={creatingRole}
                >
                  {creatingRole ? <Loader2 size={16} className="animate-spin mr-2" /> : <UserPlus size={16} className="mr-2" />}
                  Create Contract Team role
                </Button>
                <span className="text-sm text-grey-500">Creates role &quot;contract_manager&quot; for this company.</span>
              </div>
            )}
          </div>

          {/* Users list */}
          <h2 className="text-lg font-medium text-secondary-800 mb-3">Company users</h2>
          <p className="text-sm text-grey-600 mb-4">Assign Contract Team to users who should create, send, and sign contracts.</p>

          {loading ? (
            <p className="text-grey-600">Loading...</p>
          ) : (
            <div className="space-y-2">
              {users.length === 0 ? (
                <p className="text-grey-600">No users in this company yet.</p>
              ) : (
                users.map((u) => (
                  <div
                    key={u.user_id}
                    className="flex items-center justify-between p-3 border border-grey-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-secondary-800">{u.email}</p>
                      <p className="text-xs text-grey-500">
                        Roles: {u.role_names.length ? u.role_names.join(", ") : "—"}
                      </p>
                    </div>
                    {hasContractManager(u) ? (
                      <span className="text-sm text-accent-600 flex items-center gap-1">
                        <Check size={14} /> Contract Team
                      </span>
                    ) : contractManagerRole ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => assignContractManager(u.user_id)}
                        disabled={assigning === u.user_id}
                      >
                        {assigning === u.user_id ? <Loader2 size={14} className="animate-spin" /> : "Add to Contract Team"}
                      </Button>
                    ) : (
                      <span className="text-sm text-grey-500">Create role first</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
