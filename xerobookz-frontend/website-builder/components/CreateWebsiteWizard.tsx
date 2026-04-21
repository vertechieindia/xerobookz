'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

interface CreateWebsiteWizardProps {
  onComplete: (websiteId: string) => void;
  onCancel: () => void;
}

export function CreateWebsiteWizard({ onComplete, onCancel }: CreateWebsiteWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    businessType: '',
    themeId: '',
    domain: '',
    subdomain: '',
  });

  // Fetch themes
  const { data: themes } = useQuery({
    queryKey: ['themes', 'defaults'],
    queryFn: async () => {
      const response = await fetch('/api/v1/themes/defaults', {
        headers: {
          'X-Tenant-ID': localStorage.getItem('tenantId') || '',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });
      return response.json();
    },
  });

  // AI layout suggestion
  const { data: suggestedLayout } = useQuery({
    queryKey: ['ai', 'suggest-layout', formData.industry, formData.businessType],
    queryFn: async () => {
      if (!formData.industry || !formData.businessType) return null;
      const response = await fetch('/api/v1/ai/suggest-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': localStorage.getItem('tenantId') || '',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify({
          industry: formData.industry,
          businessType: formData.businessType,
        }),
      });
      return response.json();
    },
    enabled: !!formData.industry && !!formData.businessType,
  });

  // Create website mutation
  const createWebsite = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/v1/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': localStorage.getItem('tenantId') || '',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      onComplete(data.data.id);
    },
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Create website
      createWebsite.mutate({
        name: formData.name,
        themeId: formData.themeId,
        domain: formData.domain || undefined,
        subdomain: formData.subdomain || undefined,
      });
    }
  };

  const steps = [
    { number: 1, title: 'Set your business', icon: '🏢' },
    { number: 2, title: 'Add your logo', icon: '🖼️' },
    { number: 3, title: 'Select theme', icon: '🎨' },
    { number: 4, title: 'Choose features', icon: '✨' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={onCancel}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back
        </Button>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    step >= s.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s.number ? (
                    <Check size={20} />
                  ) : (
                    <span className="text-xl">{s.icon}</span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">{s.title}</div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step > s.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="max-w-2xl mx-auto">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Set Your Business
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Tell us about your business and we'll suggest the perfect layout.
                  </p>
                </div>

                <Input
                  label="Website Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Business Website"
                />

                <Select
                  label="Industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  options={[
                    { value: 'tech', label: 'Technology' },
                    { value: 'retail', label: 'Retail' },
                    { value: 'healthcare', label: 'Healthcare' },
                    { value: 'education', label: 'Education' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'real-estate', label: 'Real Estate' },
                    { value: 'food', label: 'Food & Restaurant' },
                    { value: 'fitness', label: 'Fitness & Wellness' },
                  ]}
                />

                <Select
                  label="Business Type"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  options={[
                    { value: 'startup', label: 'Startup' },
                    { value: 'small-business', label: 'Small Business' },
                    { value: 'enterprise', label: 'Enterprise' },
                    { value: 'nonprofit', label: 'Non-profit' },
                    { value: 'portfolio', label: 'Portfolio' },
                    { value: 'ecommerce', label: 'E-commerce' },
                  ]}
                />

                {suggestedLayout && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Sparkles className="text-blue-600 mr-2" size={20} />
                      <span className="font-semibold text-blue-900">AI Suggestion</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Based on your industry, we recommend a layout with hero, features, 
                      testimonials, and CTA sections.
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Add Your Logo
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Upload your logo to personalize your website.
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-4xl mb-4">🖼️</div>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your logo here, or click to browse
                  </p>
                  <Button variant="outline">Upload Logo</Button>
                </div>

                <Input
                  label="Domain (Optional)"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="mybusiness.com"
                />

                <Input
                  label="Subdomain (Optional)"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  placeholder="mybusiness"
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Select Theme
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Choose a theme that matches your brand.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {(themes?.data || []).map((theme: any) => (
                    <div
                      key={theme.id}
                      onClick={() => setFormData({ ...formData, themeId: theme.id })}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.themeId === theme.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-32 rounded mb-3"></div>
                      <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                      <p className="text-sm text-gray-600">{theme.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Choose Features
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Select additional features for your website.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'blog', name: 'Blog', description: 'Publish articles and news' },
                    { id: 'contact', name: 'Contact Form', description: 'Let visitors reach you' },
                    { id: 'ecommerce', name: 'E-commerce', description: 'Sell products online' },
                    { id: 'booking', name: 'Appointments', description: 'Allow online bookings' },
                  ].map((feature) => (
                    <label
                      key={feature.id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mr-4 w-5 h-5 text-blue-600"
                        defaultChecked
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{feature.name}</div>
                        <div className="text-sm text-gray-600">{feature.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={step === 1 && !formData.name}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {step === 4 ? 'Create Website' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
