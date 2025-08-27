"use client";

import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-500',
          confirmButton: 'bg-red-1000 hover:bg-red-600 text-white',
          iconBg: 'bg-red-100 dark:bg-red-900/20'
        };
      case 'warning':
        return {
          icon: 'text-yellow-500',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          iconBg: 'bg-yellow-50 dark:bg-yellow-900/20'
        };
      case 'info':
        return {
          icon: 'text-blue-500',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
          iconBg: 'bg-blue-50 dark:bg-blue-900/20'
        };
      default:
        return {
          icon: 'text-red-500',
          confirmButton: 'bg-red-1000 hover:bg-red-600 text-white',
          iconBg: 'bg-red-100 dark:bg-red-900/20'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[var(--background)] rounded-xl shadow-2xl border border-[var(--border)] w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex-shrink-0 w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center`}>
              <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                {title}
              </h3>
              <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] rounded-md transition-colors"
              title="Close"
            >
              <img 
                src="/sprites/x.png" 
                alt="Close" 
                className="w-4 h-4"
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105 ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
