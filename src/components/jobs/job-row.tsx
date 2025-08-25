"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, Calendar, MapPin, Building, User, Mail } from "lucide-react";
import { Job } from "@/lib/stores/jobs-store";
import { formatDistanceToNow } from "date-fns";

interface JobRowProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Job['status']) => void;
}

const STATUS_CONFIG = {
  saved: { label: 'Saved', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  screen: { label: 'Screening', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  interview: { label: 'Interview', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  offer: { label: 'Offer', color: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

export function JobRow({ job, onEdit, onDelete, onStatusChange }: JobRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (newStatus: Job['status']) => {
    onStatusChange(job.id, newStatus);
  };

  return (
    <>
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-4 items-center py-4 px-6 border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors">
        {/* Company & Position */}
        <div className="col-span-3 space-y-1">
          <div className="font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Building className="h-4 w-4 text-[var(--foreground-tertiary)]" />
            {job.company}
          </div>
          <div className="text-sm text-[var(--foreground-secondary)]">{job.position}</div>
        </div>

        {/* Location */}
        <div className="col-span-2 flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
          <MapPin className="h-4 w-4" />
          {job.location || 'Remote'}
        </div>

        {/* Status */}
        <div className="col-span-2">
          <select
            value={job.status}
            onChange={(e) => handleStatusChange(e.target.value as Job['status'])}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[job.status].color} cursor-pointer hover:opacity-80 transition-opacity`}
          >
            {Object.entries(STATUS_CONFIG).map(([value, config]) => (
              <option key={value} value={value} className="bg-white text-gray-800">
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Applied Date */}
        <div className="col-span-2 text-sm text-[var(--foreground-secondary)] flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {job.appliedDate ? formatDistanceToNow(job.appliedDate, { addSuffix: true }) : 'Not applied'}
        </div>

        {/* Salary */}
        <div className="col-span-2 text-sm text-[var(--foreground-secondary)]">
          {job.salary || 'Not specified'}
        </div>

        {/* Actions */}
        <div className="col-span-1 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 hover:bg-[var(--hover)]"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(job)}
            className="h-8 w-8 p-0 hover:bg-[var(--hover)]"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(job.id)}
            className="h-8 w-8 p-0 hover:bg-[var(--hover)] text-red-600 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-6 py-4 bg-[var(--background-secondary)] border-b border-[var(--border)]">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-[var(--foreground)] flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </h4>
              {job.contactPerson && (
                <div className="text-sm text-[var(--foreground-secondary)]">
                  <span className="font-medium">Contact:</span> {job.contactPerson}
                </div>
              )}
              {job.contactEmail && (
                <div className="text-sm text-[var(--foreground-secondary)] flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Email:</span> {job.contactEmail}
                </div>
              )}
              {job.url && (
                <div className="text-sm text-[var(--foreground-secondary)] flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2e75cc] hover:underline"
                  >
                    View Application
                  </a>
                </div>
              )}
            </div>

            {/* Notes & Tags */}
            <div className="space-y-3">
              <h4 className="font-medium text-[var(--foreground)]">Notes & Tags</h4>
              {job.notes && (
                <div className="text-sm text-[var(--foreground-secondary)]">
                  <span className="font-medium">Notes:</span> {job.notes}
                </div>
              )}
              {job.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[var(--hover)] rounded-full text-xs text-[var(--foreground-secondary)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
