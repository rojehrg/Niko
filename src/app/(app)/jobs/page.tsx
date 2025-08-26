"use client";

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Briefcase,
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  X, 
  Building, 
  CheckCircle, 
  MapPin, 
  Edit as EditIcon,
  Trash2 as TrashIcon
} from 'lucide-react'
import { useJobsStore, Job } from '@/lib/stores/jobs-store'
import JobForm from '@/components/jobs/job-form'

export default function JobsPage() {
  const { 
    jobs, 
    addJob, 
    updateJob, 
    deleteJob
  } = useJobsStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all')
  const [sortBy, setSortBy] = useState<'company' | 'position' | 'status'>('company')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showSort, setShowSort] = useState(false)

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Sort filtered jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aValue: string | number | Date, bValue: string | number | Date;
    
    switch (sortBy) {
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
        aValue = (a.company || '').toLowerCase();
        bValue = (b.company || '').toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSaveJob = (jobData: Omit<Job, 'id'>) => {
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



  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-3">
          Job Application Tracker
        </h1>
        <p className="text-lg text-[var(--foreground-secondary)] font-medium">
          Track your job applications and career progress
        </p>
      </div>
          
          {/* Controls Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Search Input */}
              {showSearch && (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)]"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearch(false)}
                    className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Filter Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowFilter(!showFilter)}
                  className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] px-4 py-2"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                
                {showFilter && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-[var(--foreground-secondary)] mb-2 px-2">Status</div>
                      {['all', 'saved', 'applied', 'interview', 'offer', 'rejected'].map((status) => (
                        <button
                          key={status}
                          onClick={() => { setStatusFilter(status as Job['status'] | 'all'); setShowFilter(false); }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-[var(--hover)] ${
                            statusFilter === status ? 'bg-[var(--primary)] text-white' : 'text-[var(--foreground)]'
                          }`}
                        >
                          {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sort Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSort(!showSort)}
                  className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] px-4 py-2"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                  Sort
                </Button>
                
                {showSort && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-[var(--foreground-secondary)] mb-2 px-2">Sort by</div>
                      {[
                        { value: 'company', label: 'Company' },
                        { value: 'position', label: 'Position' },
                        { value: 'status', label: 'Status' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => { setSortBy(option.value as 'company' | 'position' | 'status'); setShowSort(false); }}
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
            </div>
            
            <div className="flex items-center gap-3">
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

      {/* Notion-style Table */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
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
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--foreground-secondary)] w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedJobs.map((job) => (
                  <tr key={job.id} className="border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--foreground)]">{job.company}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--foreground)]">{job.position}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--foreground-secondary)]">
                      {job.location || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-1 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] rounded transition-colors"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <JobForm
              onSubmit={handleSaveJob}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingJob(null)
              }}
              initialData={editingJob || undefined}
            />
          </div>
        </div>
      )}
    </div>
  )
}
