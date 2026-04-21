'use client';

import { Button } from './ui/Button';
import { Plus, Globe, Edit, Trash2 } from 'lucide-react';

interface Website {
  id: string;
  name: string;
  domain?: string;
  subdomain?: string;
  status: string;
  theme?: { name: string };
  _count?: { pages: number };
}

interface WebsiteListProps {
  websites: Website[];
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}

export function WebsiteList({ websites, onSelect, onCreateNew }: WebsiteListProps) {
  if (websites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">🌐</div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          No websites yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first professional website in minutes
        </p>
        <Button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2" size={20} />
          Create Your First Website
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Websites</h2>
        <Button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2" size={16} />
          New Website
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((website) => (
          <div
            key={website.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {website.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Globe size={14} className="mr-1" />
                  {website.domain || website.subdomain || 'No domain set'}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      website.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {website.status}
                  </span>
                  {website._count && (
                    <span className="text-xs text-gray-600">
                      {website._count.pages} pages
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onSelect(website.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="mr-2" size={16} />
                Edit
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
