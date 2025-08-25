"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Job } from "@/lib/stores/jobs-store";

interface JobFormProps {
  onSubmit: (job: Omit<Job, 'id'>) => void;
  onCancel: () => void;
  initialData?: Partial<Job>;
}

export default function JobForm({ onSubmit, onCancel, initialData }: JobFormProps) {
  const [formData, setFormData] = useState({
    company: initialData?.company || '',
    position: initialData?.position || '',
    location: initialData?.location || '',
    status: initialData?.status || 'saved' as Job['status'],
    notes: initialData?.notes || '',
    url: initialData?.url || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set default values for empty fields to ensure the form can always be submitted
    const jobData = {
      company: formData.company || 'Unknown Company',
      position: formData.position || 'Unknown Position',
      location: formData.location || 'Remote',
      status: formData.status || 'saved',
      notes: formData.notes || '',
      url: formData.url || ''
    };
    
    onSubmit(jobData);
    
    // Automatically close the form after submission
    onCancel();
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const STATUS_OPTIONS = [
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <div className="w-full">
      <Card className="border border-[var(--border)] shadow-lg bg-[var(--background)] rounded-xl">
        <CardHeader className="pb-6 border-b border-[var(--border)] bg-[var(--background-secondary)] rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-[var(--foreground)]">
            {initialData ? 'Edit Job Application' : 'Add New Job Application'}
          </CardTitle>
          <p className="text-[var(--foreground-secondary)] mt-2">
            Track your job applications and stay organized in your career search
          </p>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="p-8 space-y-8">
            
            {/* Company & Position Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="company" className="text-sm font-semibold text-[var(--foreground)]">
                  Company Name
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Enter company name"
                  className="h-12 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="position" className="text-sm font-semibold text-[var(--foreground)]">
                  Job Position
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="Enter job title"
                  className="h-12 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 rounded-lg"
                />
              </div>
            </div>

            {/* Location & Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-sm font-semibold text-[var(--foreground)]">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="City, State or Remote"
                  className="h-12 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-semibold text-[var(--foreground)]">
                  Application Status
                </Label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="h-12 w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:outline-none transition-all duration-200"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* URL Section */}
            <div className="space-y-3">
              <Label htmlFor="url" className="text-sm font-semibold text-[var(--foreground)]">
                Job Posting URL
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://..."
                className="h-12 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 rounded-lg"
              />
            </div>

            {/* Notes Section */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-semibold text-[var(--foreground)]">
                Notes & Observations
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add any notes about the company, role, or your application process..."
                className="min-h-28 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] resize-none transition-all duration-200 rounded-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="h-12 px-8 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)] transition-all duration-200 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-12 px-10 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-lg"
              >
                {initialData ? 'Update Job' : 'Add Job'}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
