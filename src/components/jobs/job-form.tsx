"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Plus, Briefcase, User, Tag, FileText } from "lucide-react";
import { Job } from "@/lib/stores/jobs-store";

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  job?: Job | null;
  onSave: (jobData: Omit<Job, 'id' | 'lastUpdated'>) => void;
}

const STATUS_OPTIONS = [
  { value: 'saved', label: 'Saved', color: 'bg-blue-100 text-blue-800' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
  { value: 'screen', label: 'Screen', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'interview', label: 'Interview', color: 'bg-orange-100 text-orange-800' },
  { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-100 text-gray-800' },
];

const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-Time' },
  { value: 'part-time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

export function JobForm({ isOpen, onClose, job, onSave }: JobFormProps) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    jobType: 'full-time' as Job['jobType'],
    status: 'saved' as Job['status'],
    salary: '',
    notes: '',
    url: '',
    contactPerson: '',
    contactEmail: '',
    tags: [] as string[],
    isFavorite: false,
  });
  const [newTag, setNewTag] = useState('');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company,
        position: job.position,
        location: job.location,
        jobType: job.jobType,
        status: job.status,
        salary: job.salary || '',
        notes: job.notes || '',
        url: job.url || '',
        contactPerson: job.contactPerson || '',
        contactEmail: job.contactEmail || '',
        tags: job.tags,
        isFavorite: job.isFavorite,
      });
    } else {
      setFormData({
        company: '',
        position: '',
        location: '',
        jobType: 'full-time' as Job['jobType'],
        status: 'saved' as Job['status'],
        salary: '',
        notes: '',
        url: '',
        contactPerson: '',
        contactEmail: '',
        tags: [],
        isFavorite: false,
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set default values for empty fields
    const jobData = {
      ...formData,
      company: formData.company || 'Unknown Company',
      position: formData.position || 'Unknown Position',
      location: formData.location || 'Remote',
    };
    
    onSave(jobData);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-hidden">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden bg-[var(--background)] border-[var(--border)] shadow-xl">
        <CardHeader className="bg-[var(--background)] border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[var(--foreground)]">
                {job ? 'Edit Job Application' : 'Add New Job Application'}
              </CardTitle>
              <CardDescription className="text-[var(--foreground-secondary)] mt-1">
                Fill in as much or as little as you want. All fields are optional.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">
            {/* Job Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                Job Details
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Company <span className="text-[var(--foreground-tertiary)]">(optional)</span></label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company name (optional)"
                    className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Position <span className="text-[var(--foreground-tertiary)]">(optional)</span></label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Job title (optional)"
                    className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Location <span className="text-[var(--foreground-tertiary)]">(optional)</span></label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State or Remote (optional)"
                    className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Job Type</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value as Job['jobType'] }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
                  >
                    {JOB_TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Job['status'] }))}
                    className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 rounded-md"
                  >
                    {STATUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Salary <span className="text-[var(--foreground-tertiary)]">(optional)</span></label>
                  <Input
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="e.g., $80,000 - $100,000 (optional)"
                    className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Application URL <span className="text-[var(--foreground-tertiary)]">(optional)</span></label>
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://... (optional)"
                    type="url"
                    className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                Contact Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Contact Person <span className="text-[var(--foreground-tertiary)]">(optional)</span></label>
                  <Input
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Hiring manager name (optional)"
                    className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Contact Email <span className="text-[var(--foreground-tertiary)]">(optional)</span></label>
                  <Input
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="email@company.com (optional)"
                    type="email"
                    className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                Tags <span className="text-[var(--foreground-tertiary)]">(optional)</span>
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag..."
                    className="flex-1 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    size="sm"
                    className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--hover)] rounded-full text-sm text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-200"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 transition-colors duration-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                Notes <span className="text-[var(--foreground-tertiary)]">(optional)</span>
              </h3>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about this application..."
                rows={4}
                className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] resize-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
              />
            </div>
          </CardContent>
          
          {/* Form Actions */}
          <div className="flex items-center justify-between p-6 border-t border-[var(--border)] bg-[var(--background)]">
            <div className="text-sm text-[var(--foreground-secondary)]">
              All fields are optional - add what you know now, update later!
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover)] px-6 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-2 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 rounded-lg"
              >
                <Save className="mr-2 h-4 w-4" />
                {job ? 'Update Application' : 'Add Application'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
