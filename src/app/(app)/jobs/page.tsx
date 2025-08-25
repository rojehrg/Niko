"use client";

import { 
  Briefcase, 
  Plus, 
  CheckCircle, 
  Search, 
  Filter, 
  SortAsc,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Building,
  X
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { JobForm } from "@/components/jobs/job-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Job } from "@/lib/stores/jobs-store";

export default function JobsPage() {
  const { jobs, addJob, updateJob, deleteJob, updateStatus, toggleFavorite, getStats } = useJobsStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'position' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Close dropdowns when clicking outside
  const closeDropdowns = () => {
    setShowFilters(false);
    setShowSort(false);
  };

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilters || showSort) {
        closeDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showFilters, showSort]);
  
  // Filter jobs based on search and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      (job.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.position || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort filtered jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.lastUpdated || Date.now());
        bValue = new Date(b.lastUpdated || Date.now());
        break;
      case 'company':
        aValue = (a.company || '').toLowerCase();
        bValue = (b.company || '').toLowerCase();
        break;
      case 'position':
        aValue = (a.position || '').toLowerCase();
        bValue = (b.position || '').toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a.lastUpdated;
        bValue = b.lastUpdated;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSaveJob = (jobData: Omit<Job, 'id' | 'lastUpdated'>) => {
    if (editingJob) {
      updateJob(editingJob.id, jobData);
    } else {
      addJob(jobData);
    }
    setEditingJob(null);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this job application?")) {
      deleteJob(id);
    }
  };

  const handleStatusChange = (id: string, status: Job['status']) => {
    updateStatus(id, status);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'saved': return 'bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border-[var(--border)]';
      case 'applied': return 'bg-[var(--icon-bg-blue)] text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case 'screen': return 'bg-[var(--icon-bg-orange)] text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700';
      case 'interview': return 'bg-[var(--icon-bg-purple)] text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700';
      case 'offer': return 'bg-[var(--icon-bg-green)] text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'rejected': return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
      default: return 'bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border-[var(--border)]';
    }
  };

  const formatSalary = (job: Job) => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    }
    return '-';
  };

  return (
    <div className="min-h-screen">
      {/* Notion-style Header */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--icon-bg-blue)] rounded-xl flex items-center justify-center shadow-sm">
              <Briefcase className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-1">Job Application Tracker</h1>
              <p className="text-sm text-[var(--foreground-secondary)]">Track your career progress and applications</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            {showSearch && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)]"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
                  className="text-[var(--foreground-tertiary)] hover:text-[var(--foreground)]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {/* Filter Dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters); }}
                className={`text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] px-4 py-2 ${
                  statusFilter !== 'all' ? 'bg-[var(--primary)] text-white' : ''
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {statusFilter !== 'all' && <span className="ml-1 text-xs">({statusFilter})</span>}
              </Button>
              
              {showFilters && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-10" onClick={(e) => e.stopPropagation()}>
                  <div className="p-2">
                    <button
                      onClick={() => { setStatusFilter('all'); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-[var(--hover)] ${
                        statusFilter === 'all' ? 'bg-[var(--primary)] text-white' : 'text-[var(--foreground)]'
                      }`}
                    >
                      All Statuses
                    </button>
                    {['saved', 'applied', 'screen', 'interview', 'offer', 'rejected', 'withdrawn'].map((status) => (
                      <button
                        key={status}
                        onClick={() => { setStatusFilter(status as Job['status']); setShowFilters(false); }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-[var(--hover)] ${
                          statusFilter === status ? 'bg-[var(--primary)] text-white' : 'text-[var(--foreground)]'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); setShowSort(!showSort); }}
                className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] px-4 py-2"
              >
                <SortAsc className={`w-4 h-4 mr-2 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                Sort
                <span className="ml-1 text-xs text-[var(--foreground-tertiary)]">({sortBy})</span>
              </Button>
              
              {showSort && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-10" onClick={(e) => e.stopPropagation()}>
                  <div className="p-2">
                    {[
                      { value: 'date', label: 'Date' },
                      { value: 'company', label: 'Company' },
                      { value: 'position', label: 'Position' },
                      { value: 'status', label: 'Status' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value as any); setShowSort(false); }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-[var(--hover)] ${
                          sortBy === option.value ? 'bg-[var(--primary)] text-white' : 'text-[var(--foreground)]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    <div className="border-t border-[var(--border)] mt-2 pt-2">
                      <button
                        onClick={() => { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); setShowSort(false); }}
                        className="w-full text-left px-3 py-2 rounded text-sm hover:bg-[var(--hover)] text-[var(--foreground)]"
                      >
                        {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch); }}
              className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] px-4 py-2"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>
      </div>

      {/* Notion-style Table */}
      <div className="px-6 py-4">
        {sortedJobs.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-24">
            <h3 className="text-3xl font-bold text-[var(--foreground)] mb-6">No applications yet</h3>
            <p className="text-[var(--foreground-secondary)] mb-10 text-lg">Start building your career path by tracking your first job application</p>
            <Button 
              onClick={() => setIsFormOpen(true)} 
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-10 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
            >
              <Plus className="mr-3 h-6 w-6" />
              Add your first application
            </Button>
          </div>
        ) : (
          <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              {/* Notion-style Table */}
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[180px]">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Company
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[200px]">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Position
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[140px]">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[120px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date Applied
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[150px]">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Salary
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[120px]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[140px]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Contact
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[200px]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Notes
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[60px]">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sortedJobs.map((job, index) => (
                    <tr 
                      key={job.id} 
                      className="border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors group cursor-pointer"
                      onClick={() => handleEdit(job)}
                    >
                      {/* Company */}
                      <td className="py-3 px-4 border-r border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <Building className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="font-medium text-[var(--foreground)] truncate">{job.company || 'Unknown Company'}</span>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="py-3 px-4 border-r border-[var(--border)]">
                        <span className="text-[var(--foreground)] truncate">{job.position || 'Unknown Position'}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 border-r border-[var(--border)]">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status || 'saved')}`}>
                          {job.status === 'saved' && '○ Not Started'}
                          {job.status === 'applied' && '● Applied'}
                          {job.status === 'screen' && '● Screen'}
                          {job.status === 'interview' && '● Interview Scheduled'}
                          {job.status === 'offer' && '● Offer'}
                          {job.status === 'rejected' && '● Rejected'}
                        </span>
                      </td>

                      {/* Date Applied */}
                      <td className="py-3 px-4 border-r border-[var(--border)]">
                        <span className="text-[var(--foreground-secondary)] text-sm">
                          {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : '-'}
                        </span>
                      </td>

                      {/* Salary Range */}
                      <td className="py-3 px-4 border-r border-[var(--border)]">
                        <span className="text-[var(--foreground)] text-sm">
                          {formatSalary(job)}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 border-r border-[var(--border)]">
                        <span className="text-[var(--foreground-secondary)] text-sm truncate">
                          {job.location || 'Remote'}
                        </span>
                      </td>

                      {/* Contact Person */}
                      <td className="py-3 px-4 border-r border-[var(--border)]">
                        <span className="text-[var(--foreground-secondary)] text-sm truncate">
                          {job.contactPerson || job.contactEmail || 'HR Department'}
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-4 border-r border-[var(--border)]">
                        <span className="text-[var(--foreground-secondary)] text-sm truncate">
                          {job.notes ? job.notes.substring(0, 30) + (job.notes.length > 30 ? '...' : '') : 'Add notes...'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {job.applicationUrl || job.url ? (
                            <a 
                              href={job.applicationUrl || job.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[var(--primary)] hover:bg-[var(--hover)] p-1 rounded"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : null}
                          <button 
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--foreground-tertiary)] hover:bg-[var(--hover)] p-1 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add more options menu
                            }}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Add New Row */}
                  <tr 
                    className="border-t border-[var(--border)] hover:bg-[var(--hover)] transition-colors cursor-pointer text-[var(--foreground-tertiary)]"
                    onClick={() => setIsFormOpen(true)}
                  >
                    <td colSpan={9} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">New Item</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      <JobForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingJob(null);
        }}
        job={editingJob}
        onSave={handleSaveJob}
      />
    </div>
  );
}
