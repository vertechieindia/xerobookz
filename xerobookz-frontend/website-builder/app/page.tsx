'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WebsiteBuilderDashboard } from '@/components/WebsiteBuilderDashboard';
import { WebsiteList } from '@/components/WebsiteList';
import { CreateWebsiteWizard } from '@/components/CreateWebsiteWizard';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function WebsiteBuilderPage() {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);

  const { data: websites, isLoading } = useQuery({
    queryKey: ['websites'],
    queryFn: async () => {
      const response = await fetch('/api/v1/websites', {
        headers: {
          'X-Tenant-ID': localStorage.getItem('tenantId') || '',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });
      return response.json();
    },
  });

  if (showCreateWizard) {
    return (
      <CreateWebsiteWizard
        onComplete={(websiteId) => {
          setShowCreateWizard(false);
          setSelectedWebsiteId(websiteId);
        }}
        onCancel={() => setShowCreateWizard(false)}
      />
    );
  }

  if (selectedWebsiteId) {
    return (
      <WebsiteBuilderDashboard
        websiteId={selectedWebsiteId}
        onBack={() => setSelectedWebsiteId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Professional Website in Minutes
          </h1>
          <p className="text-xl text-gray-600">
            XeroBookz Website is changing how people think about website design. 
            Thanks to its user-friendly and intuitive interface, you can create, 
            manage, and customize your website effortlessly.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Free, forever, with unlimited users.
              </h2>
              <p className="text-gray-600">See why millions trust XeroBookz</p>
            </div>
            <Button
              onClick={() => setShowCreateWizard(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
            >
              <Plus className="mr-2" size={20} />
              Create Website
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <FeatureCard
            icon="🎨"
            title="No technical skills required"
            description="Dream it? Build it! Let AI suggest your website layout and content based on your industry."
          />
          <FeatureCard
            icon="🖱️"
            title="Craft your site like a designer"
            description="Drag and drop building blocks. Make precise adjustments, add filters, animate elements - all directly on the page."
          />
          <FeatureCard
            icon="🤖"
            title="Your AI sidekick"
            description="Boost your copy-writing with AI. Generate website content from a simple prompt or improve existing text."
          />
        </div>

        {/* Website List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <WebsiteList
            websites={websites?.data || []}
            onSelect={(id) => setSelectedWebsiteId(id)}
            onCreateNew={() => setShowCreateWizard(true)}
          />
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
