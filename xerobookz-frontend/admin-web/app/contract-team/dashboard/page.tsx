"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@xerobookz/ui-shared";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  FileText,
  Send,
  Inbox,
  Plus,
  ChevronRight,
  Sparkles,
  PenTool,
  Download,
  XeroBookzLogo,
  Bell,
  Settings,
} from "lucide-react";

const API_BASE = typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_API_URL || "";
const CONTRACT_TYPES = ["MSA", "NDA", "PO", "WO", "SOW", "OTHER"];

interface Contract {
  id: string;
  contract_type: string;
  title: string;
  status: string;
  created_at: string;
  parties?: { email: string; status: string }[];
}

export default function ContractTeamDashboard() {
  return (
    <AuthGuard requiredRole={["contract_manager", "admin"]}>
      <ContractTeamDashboardContent />
    </AuthGuard>
  );
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

function ContractTeamDashboardContent() {
  const router = useRouter();
  const [myContracts, setMyContracts] = useState<Contract[]>([]);
  const [receivedContracts, setReceivedContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    contract_type: "NDA",
    title: "",
    description: "",
  });
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [aiSummary, setAiSummary] = useState<{ summary: string; recommendation: string } | null>(null);
  const [signModal, setSignModal] = useState<{ contractId: string; accept: boolean } | null>(null);
  const [signatureText, setSignatureText] = useState("");
  const [sendModal, setSendModal] = useState<{ contractId: string } | null>(null);
  const [sendRecipients, setSendRecipients] = useState("");
  const [sendSubmitting, setSendSubmitting] = useState(false);

  const fetchMy = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/v1/contracts`, { headers: getAuthHeaders() });
      const data = await r.json();
      if (data.data) setMyContracts(Array.isArray(data.data) ? data.data : []);
    } catch {
      setMyContracts([]);
    }
  };

  const fetchReceived = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/v1/contracts/received`, { headers: getAuthHeaders() });
      const data = await r.json();
      if (data.data) setReceivedContracts(Array.isArray(data.data) ? data.data : []);
    } catch {
      setReceivedContracts([]);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchMy(), fetchReceived()]);
      setLoading(false);
    })();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const form = new FormData();
      form.append("contract_type", createForm.contract_type);
      form.append("title", createForm.title);
      if (createForm.description) form.append("description", createForm.description);
      if (createFile) form.append("file", createFile);
      const headers = getAuthHeaders();
      delete (headers as Record<string, string>)["Content-Type"];
      const r = await fetch(`${API_BASE}/api/v1/contracts`, {
        method: "POST",
        headers,
        body: form,
      });
      const data = await r.json();
      if (data.success) {
        setShowCreateModal(false);
        setCreateForm({ contract_type: "NDA", title: "", description: "" });
        setCreateFile(null);
        fetchMy();
      } else {
        alert(data.error?.details || "Create failed");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openView = (c: Contract) => {
    setSelectedContract(c);
    setAiSummary(null);
  };

  const fetchAiSummary = async (contractId: string) => {
    try {
      const r = await fetch(`${API_BASE}/api/v1/contracts/${contractId}/ai-summary`, {
        headers: getAuthHeaders(),
      });
      const data = await r.json();
      if (data.data) setAiSummary({ summary: data.data.summary, recommendation: data.data.recommendation });
    } catch {
      setAiSummary({ summary: "AI summary unavailable.", recommendation: "review_carefully" });
    }
  };

  const handleSign = async () => {
    if (!signModal) return;
    try {
      const r = await fetch(`${API_BASE}/api/v1/contracts/${signModal.contractId}/sign`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          signature_data: signatureText || undefined,
          signature_type: "typed",
          accept: signModal.accept,
        }),
      });
      const data = await r.json();
      if (data.success) {
        setSignModal(null);
        setSignatureText("");
        setSelectedContract(null);
        fetchReceived();
        fetchMy();
      } else {
        alert(data.error?.details || "Sign failed");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Sign failed");
    }
  };

  const handleSend = async () => {
    if (!sendModal) return;
    const emails = sendRecipients.split(/[\n,;]+/).map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0) {
      alert("Enter at least one recipient email.");
      return;
    }
    setSendSubmitting(true);
    try {
      const r = await fetch(`${API_BASE}/api/v1/contracts/${sendModal.contractId}/send`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ recipients: emails }),
      });
      const data = await r.json();
      if (data.success) {
        setSendModal(null);
        setSendRecipients("");
        fetchMy();
        setSelectedContract(null);
      } else {
        alert(data.error?.details || "Send failed");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSendSubmitting(false);
    }
  };

  const downloadUrl = (id: string) =>
    `${API_BASE}/api/v1/contracts/${id}/download?${new URLSearchParams({})}`;

  const list = activeTab === "sent" ? myContracts : receivedContracts;

  return (
    <div className="min-h-screen bg-grey-50">
      <nav className="bg-white border-b border-grey-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <XeroBookzLogo size="md" />
              <h1 className="text-xl font-semibold text-secondary-800">Contract Team</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell size={16} className="mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="floating" className="p-6">
            <div className="p-3 bg-primary-50 rounded-lg inline-block mb-4">
              <Send className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-800">{myContracts.length}</h3>
            <p className="text-sm text-grey-600">Sent by me</p>
          </Card>
          <Card variant="floating" className="p-6">
            <div className="p-3 bg-accent-50 rounded-lg inline-block mb-4">
              <Inbox className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-800">{receivedContracts.length}</h3>
            <p className="text-sm text-grey-600">Pending my signature</p>
          </Card>
          <Card variant="floating" className="p-6 cursor-pointer" onClick={() => setShowCreateModal(true)}>
            <div className="p-3 bg-warning-50 rounded-lg inline-block mb-4">
              <Plus className="w-6 h-6 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-800">New contract</h3>
            <p className="text-sm text-grey-600">Create MSA, NDA, PO, WO, SOW</p>
          </Card>
        </div>

        <Card variant="default" className="p-6">
          <div className="flex gap-4 border-b border-grey-200 mb-6">
            <button
              className={`pb-2 px-1 font-medium ${activeTab === "sent" ? "border-b-2 border-primary-600 text-primary-600" : "text-grey-600"}`}
              onClick={() => setActiveTab("sent")}
            >
              Sent by me
            </button>
            <button
              className={`pb-2 px-1 font-medium ${activeTab === "received" ? "border-b-2 border-primary-600 text-primary-600" : "text-grey-600"}`}
              onClick={() => setActiveTab("received")}
            >
              Pending my signature
            </button>
          </div>

          {loading ? (
            <p className="text-grey-600">Loading...</p>
          ) : (
            <div className="space-y-3">
              {list.length === 0 ? (
                <p className="text-grey-600">No contracts.</p>
              ) : (
                list.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-4 border border-grey-200 rounded-lg hover:bg-grey-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-grey-500" />
                      <div>
                        <p className="font-medium text-secondary-800">{c.title}</p>
                        <p className="text-sm text-grey-500">
                          {c.contract_type} · {c.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(downloadUrl(c.id), "_blank")}>
                        <Download size={14} />
                      </Button>
                      <Button variant="default" size="sm" onClick={() => openView(c)}>
                        View <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card variant="default" className="p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Create contract</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-grey-700 mb-1">Type</label>
                <select
                  value={createForm.contract_type}
                  onChange={(e) => setCreateForm((f) => ({ ...f, contract_type: e.target.value }))}
                  className="w-full border border-grey-300 rounded-lg px-3 py-2"
                >
                  {CONTRACT_TYPES.map((t) => (
                    <option key={t} value={t.toLowerCase()}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-700 mb-1">Title *</label>
                <input
                  value={createForm.title}
                  onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-grey-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-700 mb-1">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-grey-300 rounded-lg px-3 py-2"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-700 mb-1">Attach PDF (optional)</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => setCreateFile(e.target.files?.[0] || null)}
                  className="w-full border border-grey-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createSubmitting || !createForm.title.trim()}>
                  Create
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* View / AI Summary / Sign modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card variant="default" className="p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedContract.title}</h2>
                <p className="text-sm text-grey-500">{selectedContract.contract_type} · {selectedContract.status}</p>
              </div>
              <button onClick={() => { setSelectedContract(null); setAiSummary(null); setSignModal(null); }} className="text-grey-500 hover:text-grey-700">✕</button>
            </div>
            {selectedContract.parties?.length ? (
              <p className="text-sm text-grey-600 mb-2">
                Recipients: {selectedContract.parties.map((p) => p.email).join(", ")}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => window.open(downloadUrl(selectedContract.id), "_blank")}>
                <Download size={14} className="mr-1" /> Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => fetchAiSummary(selectedContract.id)}>
                <Sparkles size={14} className="mr-1" /> AI Quick read
              </Button>
              {activeTab === "sent" && selectedContract.status === "draft" && (
                <Button variant="default" size="sm" onClick={() => setSendModal({ contractId: selectedContract.id })}>
                  <Send size={14} className="mr-1" /> Send for signature
                </Button>
              )}
              {activeTab === "received" && selectedContract.status === "sent" && (
                <>
                  <Button variant="default" size="sm" onClick={() => setSignModal({ contractId: selectedContract.id, accept: true })}>
                    <PenTool size={14} className="mr-1" /> Sign
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSignModal({ contractId: selectedContract.id, accept: false })}>
                    Decline
                  </Button>
                </>
              )}
            </div>
            {aiSummary && (
              <div className="p-4 bg-primary-50 rounded-lg mb-4">
                <h3 className="font-medium text-secondary-800 mb-2">AI Summary</h3>
                <p className="text-sm text-grey-700 whitespace-pre-wrap">{aiSummary.summary}</p>
                <p className="text-sm mt-2">
                  Recommendation: <span className={aiSummary.recommendation === "sign" ? "text-green-600" : aiSummary.recommendation === "do_not_sign" ? "text-red-600" : "text-amber-600"}>{aiSummary.recommendation.replace("_", " ")}</span>
                </p>
              </div>
            )}
            {signModal && signModal.contractId === selectedContract.id && (
              <div className="p-4 border border-grey-200 rounded-lg">
                <h3 className="font-medium mb-2">{signModal.accept ? "Sign document" : "Decline document"}</h3>
                {signModal.accept && (
                  <input
                    placeholder="Type your full name (signature)"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    className="w-full border border-grey-300 rounded-lg px-3 py-2 mb-2"
                  />
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSignModal(null)}>Cancel</Button>
                  <Button onClick={handleSign}>{signModal.accept ? "Confirm sign" : "Confirm decline"}</Button>
                </div>
              </div>
            )}
            {sendModal && sendModal.contractId === selectedContract.id && (
              <div className="p-4 border border-grey-200 rounded-lg">
                <h3 className="font-medium mb-2">Send for signature</h3>
                <textarea
                  placeholder="Recipient emails (one per line or comma-separated)"
                  value={sendRecipients}
                  onChange={(e) => setSendRecipients(e.target.value)}
                  className="w-full border border-grey-300 rounded-lg px-3 py-2 mb-2"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSendModal(null)}>Cancel</Button>
                  <Button onClick={handleSend} disabled={sendSubmitting || !sendRecipients.trim()}>Send</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
