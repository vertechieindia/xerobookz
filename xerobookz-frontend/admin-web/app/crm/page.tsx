"use client";

import { useState } from "react";
import { useLeads, useCreateLead, useUpdateLead, useScoreLead } from "@xerobookz/api-clients";
import { Button } from "@xerobookz/ui-shared";
import { Plus, TrendingUp } from "lucide-react";

export default function CRMPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: leads, isLoading } = useLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const scoreLead = useScoreLead();

  const handleScoreLead = async (id: string) => {
    await scoreLead.mutateAsync(id);
  };

  if (isLoading) {
    return <div className="p-8">Loading leads...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-grey-900">CRM - Leads</h1>
          <p className="text-grey-600 mt-1">Manage your sales leads and opportunities</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads?.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-lg shadow-sm border border-grey-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-grey-900">{lead.name}</h3>
                {lead.company && (
                  <p className="text-sm text-grey-600 mt-1">{lead.company}</p>
                )}
              </div>
              {lead.score !== undefined && (
                <div className="flex items-center gap-1 text-primary-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{lead.score}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {lead.email && (
                <p className="text-sm text-grey-600">{lead.email}</p>
              )}
              {lead.phone && (
                <p className="text-sm text-grey-600">{lead.phone}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                lead.status === "new" ? "bg-blue-100 text-blue-700" :
                lead.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                lead.status === "qualified" ? "bg-green-100 text-green-700" :
                "bg-grey-100 text-grey-700"
              }`}>
                {lead.status}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScoreLead(lead.id)}
                disabled={scoreLead.isPending}
              >
                Score Lead
              </Button>
            </div>
          </div>
        ))}
      </div>

      {leads?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-grey-600 mb-4">No leads yet</p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Your First Lead
          </Button>
        </div>
      )}
    </div>
  );
}
