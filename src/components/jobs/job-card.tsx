"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Building, MapPin, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Job } from "@/lib/stores/jobs-store";
import { JobProgress } from "./job-progress";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Job['status']) => void;
  onToggleFavorite: (id: string) => void;
}

export function JobCard({ job, onEdit, onDelete, onStatusChange, onToggleFavorite }: JobCardProps) {
  const [showActions, setShowActions] = useState(false);

  const handleStatusChange = (status: Job['status']) => {
    onStatusChange(job.id, status);
  };

  const getCompanyInitials = (company: string) => {
    if (!company || company === 'Unknown Company') {
      return '??';
    }
    return company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-center justify-between mb-3">
        {/* Left side - Job details */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Company Logo */}
          <div className="w-10 h-10 bg-[var(--hover)] rounded-lg flex items-center justify-center text-[var(--foreground-secondary)] font-medium text-sm flex-shrink-0">
            {getCompanyInitials(job.company)}
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-[var(--foreground)] truncate">
                {job.position || 'Untitled Position'}
              </h3>
              {job.isFavorite && (
                <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-[var(--foreground-secondary)] truncate">
              {job.company || 'Unknown Company'}
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(!showActions)}
            className="h-8 w-8 p-0 hover:bg-[var(--hover)]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onEdit(job);
                  setShowActions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--hover)] rounded-t-lg"
              >
                <Edit className="h-3 w-3 mr-2 inline" />
                Edit
              </button>
              <button
                onClick={() => {
                  onToggleFavorite(job.id);
                  setShowActions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--hover)]"
              >
                <Heart className="h-3 w-3 mr-2 inline" />
                {job.isFavorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button
                onClick={() => {
                  onDelete(job.id);
                  setShowActions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
              >
                <Trash2 className="h-3 w-3 mr-2 inline" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Simplified Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          job.status === 'saved' ? 'bg-gray-100 text-gray-700' :
          job.status === 'applied' ? 'bg-blue-100 text-blue-700' :
          job.status === 'screen' ? 'bg-yellow-100 text-yellow-700' :
          job.status === 'interview' ? 'bg-orange-100 text-orange-700' :
          job.status === 'offer' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
        
        {job.location && (
          <div className="flex items-center text-xs text-[var(--foreground-tertiary)]">
            <MapPin className="h-3 w-3 mr-1" />
            {job.location}
          </div>
        )}
      </div>

      {/* Quick Details */}
      <div className="space-y-1">
        {job.salary && (
          <p className="text-xs text-[var(--foreground-secondary)]">
            {job.salary}
          </p>
        )}
        
        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {job.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-[var(--hover)] text-xs text-[var(--foreground-tertiary)] rounded"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 2 && (
              <span className="text-xs text-[var(--foreground-tertiary)]">
                +{job.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
