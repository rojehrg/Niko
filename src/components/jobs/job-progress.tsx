"use client";

import { Job } from "@/lib/stores/jobs-store";
import { formatDistanceToNow } from "date-fns";

interface JobProgressProps {
  job: Job;
  onStatusChange: (status: Job['status']) => void;
}

const STAGES = [
  { key: 'saved', label: 'Saved', color: 'bg-blue-500' },
  { key: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { key: 'screen', label: 'Screen', color: 'bg-blue-500' },
  { key: 'interview', label: 'Interview', color: 'bg-blue-500' },
  { key: 'offer', label: 'Offer', color: 'bg-blue-500' },
] as const;

export function JobProgress({ job, onStatusChange }: JobProgressProps) {
  const getStageDate = (stage: Job['status']) => {
    switch (stage) {
      case 'saved': return job.savedDate;
      case 'applied': return job.appliedDate;
      case 'screen': return job.screenDate;
      case 'interview': return job.interviewDate;
      case 'offer': return job.offerDate;
      default: return null;
    }
  };

  const getCurrentStageIndex = () => {
    return STAGES.findIndex(stage => stage.key === job.status);
  };

  const currentStageIndex = getCurrentStageIndex();

  return (
    <div className="flex items-center space-x-2">
      {STAGES.map((stage, index) => {
        const isCompleted = index <= currentStageIndex;
        const isCurrent = index === currentStageIndex;
        return (
          <div key={stage.key} className="flex items-center">
            {/* Stage Circle */}
            <button
              onClick={() => onStatusChange(stage.key as Job['status'])}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                isCompleted 
                  ? stage.color 
                  : 'bg-gray-300 hover:bg-gray-400'
              } ${isCurrent ? 'ring-2 ring-blue-200 ring-offset-2' : ''}`}
              title={`Click to set status to ${stage.label}`}
            />
            
            {/* Connecting Line */}
            {index < STAGES.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${
                isCompleted ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
      
      {/* Stage Labels */}
      <div className="ml-4 flex flex-col space-y-1">
        {STAGES.map((stage, index) => {
          const stageDate = getStageDate(stage.key as Job['status']);
          const isCompleted = index <= currentStageIndex;
          
          return (
            <div key={stage.key} className="flex items-center space-x-2">
              <span className={`text-xs font-medium ${
                isCompleted ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {stage.label}
              </span>
              {stageDate && (
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(stageDate, { addSuffix: true })}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
