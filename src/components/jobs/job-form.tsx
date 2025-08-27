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
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Company & Position Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-[var(--foreground)] mb-3">
              Company Name
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Enter company name"
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background-secondary)]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position" className="text-sm font-medium text-[var(--foreground)] mb-3">
              Job Position
            </Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              placeholder="Enter job title"
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background-secondary)]"
            />
          </div>
        </div>

        {/* Location & Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-[var(--foreground)] mb-3">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, State or Remote"
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background-secondary)]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-[var(--foreground)] mb-3">
              Application Status
            </Label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background-secondary)] text-[var(--foreground)]"
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
                  <div className="space-y-2">
                         <Label htmlFor="url" className="text-sm font-medium text-[var(--foreground)] mb-3">
               Job Posting URL
             </Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-[var(--background-secondary)]"
          />
        </div>

        {/* Notes Section */}
                  <div className="space-y-2">
                         <Label htmlFor="notes" className="text-sm font-medium text-[var(--foreground)] mb-3">
               Notes & Observations
             </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add any notes about the company, role, or your application process..."
            className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none transition-all duration-200 bg-[var(--background-secondary)] min-h-[100px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2.5 px-4 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            {initialData ? 'Update Job' : 'Add Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}
