'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/Button';
import { ArrowLeft, Eye, Save, Sparkles } from 'lucide-react';
import { PageEditor } from './PageEditor';
import { AISidebar } from './AISidebar';

interface WebsiteBuilderDashboardProps {
  websiteId: string;
  onBack: () => void;
}

export function WebsiteBuilderDashboard({ websiteId, onBack }: WebsiteBuilderDashboardProps) {
  const [showAI, setShowAI] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  const { data: website, isLoading } = useQuery({
    queryKey: ['website', websiteId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/websites/${websiteId}`, {
        headers: {
          'X-Tenant-ID': localStorage.getItem('tenantId') || '',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pages = website?.data?.pages || [];
  const currentPage = selectedPageId
    ? pages.find((p: any) => p.id === selectedPageId)
    : pages.find((p: any) => p.isHomePage) || pages[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost">
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {website?.data?.name || 'Website Builder'}
            </h1>
            <p className="text-sm text-gray-600">
              {website?.data?.domain || website?.data?.subdomain || 'No domain'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAI(!showAI)}
            variant="outline"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
          >
            <Sparkles className="mr-2" size={16} />
            AI Assistant
          </Button>
          <Button variant="outline">
            <Eye className="mr-2" size={16} />
            Preview
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="mr-2" size={16} />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Pages</h2>
            <Button
              onClick={() => {}}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              + New Page
            </Button>
          </div>

          <div className="space-y-1">
            {pages.map((page: any) => (
              <button
                key={page.id}
                onClick={() => setSelectedPageId(page.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  currentPage?.id === page.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page.title}
                {page.isHomePage && (
                  <span className="ml-2 text-xs text-gray-500">(Home)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 relative">
          {currentPage && (
            <PageEditor
              page={currentPage}
              websiteId={websiteId}
              theme={website?.data?.theme}
            />
          )}
        </div>

        {/* AI Sidebar */}
        {showAI && (
          <AISidebar
            websiteId={websiteId}
            onClose={() => setShowAI(false)}
          />
        )}
      </div>
    </div>
  );
}
