'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X, Sparkles, Loader } from 'lucide-react';

interface AISidebarProps {
  websiteId: string;
  onClose: () => void;
}

export function AISidebar({ websiteId, onClose }: AISidebarProps) {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'layout' | 'content' | 'seo'>('content');

  const generate = useMutation({
    mutationFn: async (data: { type: string; prompt: string }) => {
      const response = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': localStorage.getItem('tenantId') || '',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify({
          ...data,
          websiteId,
        }),
      });
      return response.json();
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generate.mutate({ type, prompt });
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <Button onClick={onClose} variant="ghost" size="sm">
          <X size={16} />
        </Button>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to generate?
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="content">Content</option>
            <option value="layout">Layout</option>
            <option value="seo">SEO Metadata</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe what you need
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Create a hero section for a tech startup..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || generate.isPending}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          {generate.isPending ? (
            <>
              <Loader className="mr-2 animate-spin" size={16} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2" size={16} />
              Generate
            </>
          )}
        </Button>

        {generate.data && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Generated Result:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(generate.data.data, null, 2)}
            </pre>
            <Button
              onClick={() => {}}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Use This Content
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Powered by AI. Results may vary. Review and edit as needed.
        </p>
      </div>
    </div>
  );
}
