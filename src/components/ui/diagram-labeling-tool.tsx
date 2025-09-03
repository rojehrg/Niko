'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Plus, Save, Play, Check, X } from 'lucide-react';
import { DiagramLabelingService, Diagram, Label } from '@/lib/services/diagram-labeling-service';

interface LocalLabel {
  id: number;
  x: number;
  y: number;
  answer: string;
}

export default function DiagramLabelingTool() {
  const [currentMode, setCurrentMode] = useState<'select' | 'create' | 'study'>('select');
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [labels, setLabels] = useState<LocalLabel[]>([]);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newDiagramTitle, setNewDiagramTitle] = useState('');
  const [studyAnswers, setStudyAnswers] = useState<Record<number, string>>({});
  const [studyResults, setStudyResults] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Load diagrams from Supabase on component mount
  useEffect(() => {
    loadDiagrams();
  }, []);

  const loadDiagrams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const diagramsData = await DiagramLabelingService.getDiagrams();
      setDiagrams(diagramsData);
    } catch (err) {
      console.error('Error loading diagrams:', err);
      setError('Failed to load diagrams');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setLabels([]);
        setCurrentMode('create');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = useCallback((event: React.MouseEvent<HTMLImageElement>) => {
    if (!isAddingLabel || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const newLabel: LocalLabel = {
      id: labels.length + 1,
      x,
      y,
      answer: ''
    };

    setLabels(prev => [...prev, newLabel]);
    setIsAddingLabel(false);
  }, [isAddingLabel, labels.length]);

  const handleAnswerChange = (labelId: number, answer: string) => {
    setLabels(prev => prev.map(label => 
      label.id === labelId ? { ...label, answer } : label
    ));
  };

  const handleSaveDiagram = async () => {
    console.log('Save button clicked!', { uploadedImage: !!uploadedImage, title: newDiagramTitle, labelsCount: labels.length });
    if (!uploadedImage || !newDiagramTitle.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Create the diagram in Supabase
      const newDiagram = await DiagramLabelingService.createDiagram(newDiagramTitle, uploadedImage);

      if (!newDiagram) {
        throw new Error('Failed to create diagram');
      }

      // Add all labels to the diagram
      for (const label of labels) {
        await DiagramLabelingService.addLabel(
          newDiagram.id,
          label.id,
          label.x,
          label.y,
          label.answer
        );
      }

      // Reload diagrams to get the updated data
      await loadDiagrams();

      // Reset form
      setUploadedImage(null);
      setLabels([]);
      setNewDiagramTitle('');
      setCurrentMode('select');
    } catch (err) {
      console.error('Error saving diagram:', err);
      setError('Failed to save diagram');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartStudy = (diagram: Diagram) => {
    setSelectedDiagram(diagram);
    setStudyAnswers({});
    setStudyResults({});
    setCurrentMode('study');
  };

  const handleStudyAnswerChange = (labelId: number, answer: string) => {
    setStudyAnswers(prev => ({ ...prev, [labelId]: answer }));
  };

  // Prevent auto-submit when all answers are filled
  useEffect(() => {
    if (!selectedDiagram) return;
    
    const totalLabels = selectedDiagram.labels?.length || 0;
    const answeredCount = Object.keys(studyAnswers).length;
    
    // Log for debugging
    console.log('Study progress:', answeredCount, '/', totalLabels);
    
    // Do NOT auto-submit when all answers are filled
    // User must manually click "Check Answers"
    
  }, [studyAnswers, selectedDiagram]);

  const checkStudyAnswers = () => {
    if (!selectedDiagram) return;

    const results: Record<number, boolean> = {};
    selectedDiagram.labels?.forEach(label => {
      const userAnswer = studyAnswers[label.label_number]?.toLowerCase().trim();
      const correctAnswer = label.answer.toLowerCase().trim();
      results[label.label_number] = userAnswer === correctAnswer;
    });

    setStudyResults(results);
  };

  const resetStudy = () => {
    setStudyAnswers({});
    setStudyResults({});
  };

  if (currentMode === 'select') {
    return (
      <div className="min-h-screen py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight mb-2">
              Labels
            </h1>
            <p className="text-[var(--foreground-secondary)] text-lg">
              Create and study labeled diagrams for any subject
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Create New Diagram */}
          <div className="mb-6">
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-md hover:border-[var(--border-hover)] transition-all duration-150 p-4 max-w-md mx-auto">
              <div className="text-center">
                <Upload className="w-10 h-10 text-[var(--primary)] mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Create New Diagram</h2>
                <p className="text-[var(--foreground-secondary)] text-sm mb-4">Upload an image and add numbered labels</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[var(--background-secondary)] hover:bg-[var(--hover)] text-[var(--foreground)] border border-[var(--border)] rounded-md font-medium transition-all duration-150 px-4 py-2 h-10 text-sm"
                >
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          {/* Your Diagrams */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Your Diagrams</h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                <p className="text-[var(--foreground-secondary)]">Loading diagrams...</p>
              </div>
            ) : diagrams.length === 0 ? (
              <div className="text-center py-12 bg-[var(--background-secondary)] border border-[var(--border)] rounded-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--background)] rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-[var(--foreground-secondary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No diagrams created yet</h3>
                <p className="text-[var(--foreground-secondary)]">Create your first diagram to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diagrams.map(diagram => (
                  <div key={diagram.id} className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-md p-4 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => handleStartStudy(diagram)}>
                    <div className="aspect-video bg-[var(--background)] rounded-md mb-3 overflow-hidden">
                      <img 
                        src={diagram.image_url} 
                        alt={diagram.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-1 truncate">{diagram.title}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {diagram.labels?.length || 0} labels • {new Date(diagram.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
    );
  }

  if (currentMode === 'create') {
    return (
      <div className="min-h-screen py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-3">Create Labeled Diagram</h1>
              <p className="text-[var(--foreground-secondary)] text-lg">Upload an image and add numbered labels</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentMode('select')}
                className="bg-[#FF6961]/80 hover:bg-[#FF6961]/60 text-white px-6 h-11 font-medium transition-all duration-150 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDiagram}
                disabled={!uploadedImage || !newDiagramTitle.trim() || labels.length === 0 || isLoading}
                className="bg-[#80EF80] dark:bg-[#77dd77]/40 hover:bg-[#80EF80]/90 dark:hover:bg-[#77dd77]/60 text-white dark:text-white border border-[#80EF80] dark:border-[#77dd77]/30 px-6 h-11 font-medium transition-all duration-150 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLoading ? 'Saving...' : 'Save Diagram'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Labels List - Left Side */}
            <div className="lg:col-span-1 min-w-0">
              <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl pt-1 px-6 pb-6 h-fit">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Labels ({labels.length})</h3>
                
                {labels.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[var(--foreground-tertiary)]">No labels added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {labels.map(label => (
                      <div key={label.id} className="flex items-center gap-2 w-full">
                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                          {label.id}
                        </div>
                        <input
                          type="text"
                          placeholder="Enter answer..."
                          value={label.answer}
                          onChange={(e) => handleAnswerChange(label.id, e.target.value)}
                          className="flex-1 min-w-0 px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-150 bg-[var(--background)] text-[var(--foreground)] text-sm h-10"
                        />
                        <button
                          onClick={() => {
                            setLabels(prev => {
                              const filtered = prev.filter(l => l.id !== label.id);
                              // Reset IDs to be sequential
                              return filtered.map((l, index) => ({ ...l, id: index + 1 }));
                            });
                          }}
                          className="text-[var(--accent-red)] hover:text-red-700 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image Area - Right Side */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Enter diagram title..."
                    value={newDiagramTitle}
                    onChange={(e) => setNewDiagramTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-150 bg-[var(--background)] text-[var(--foreground)] text-sm h-10"
                  />
                </div>
                
                <div className="relative mb-6">
                  {uploadedImage && (
                    <img
                      ref={imageRef}
                      src={uploadedImage}
                      alt="Diagram to label"
                      className="w-full h-auto max-h-[600px] object-contain cursor-crosshair rounded-lg border border-[var(--border)]"
                      onClick={handleImageClick}
                    />
                  )}
                  
                  {/* Render labels */}
                  {labels.map(label => (
                    <div
                      key={label.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${label.x}%`, top: `${label.y}%` }}
                    >
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                        {label.id}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsAddingLabel(!isAddingLabel)}
                    className={`px-4 py-2 h-10 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                      isAddingLabel 
                        ? 'bg-[#FF6961]/80 hover:bg-[#FF6961]/60 text-white' 
                        : 'bg-[var(--background-secondary)] hover:bg-[var(--hover)] text-[var(--foreground)] border border-[var(--border)]'
                    }`}
                  >
                    {isAddingLabel ? (
                      <>
                        <X className="w-4 h-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Label
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }

  if (currentMode === 'study' && selectedDiagram) {
    const totalLabels = selectedDiagram.labels?.length || 0;
    const correctAnswers = Object.values(studyResults).filter(Boolean).length;
    // Only consider complete when user has manually checked answers (studyResults has values)
    const isComplete = Object.keys(studyResults).length > 0;

    return (
      <div className="min-h-screen py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight mb-2 truncate">{selectedDiagram.title}</h1>
              <p className="text-[var(--foreground-secondary)] text-lg">Study Mode - Click numbers to test your knowledge</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetStudy}
                className="bg-[#6B6B6B]/70 dark:bg-[#6B6B6B] hover:bg-[#5A5A5A]/60 dark:hover:bg-[#5A5A5A] text-white h-11 px-6 font-medium transition-all duration-150 rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={() => setCurrentMode('select')}
                className="bg-[#787774]/70 dark:bg-[#787774] hover:bg-[#6B6B6B]/60 dark:hover:bg-[#6B6B6B] text-white h-11 px-6 font-medium transition-all duration-150 rounded-lg"
              >
                Back
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Study Interface - Left Side */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-md p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Study Progress</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 bg-[var(--background)] rounded-full h-2">
                      <div 
                        className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(Object.keys(studyAnswers).length / totalLabels) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-[var(--foreground-secondary)]">
                      {Object.keys(studyAnswers).length}/{totalLabels}
                    </span>
                  </div>
                  

                </div>

                <div className="space-y-3">
                  {selectedDiagram.labels?.map(label => (
                    <div key={label.id} className="p-3 border border-[var(--border)] rounded-md bg-[var(--background)]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {label.label_number}
                        </div>

                        {studyResults[label.label_number] === true && (
                          <div className="w-6 h-6 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-[var(--foreground)]" />
                          </div>
                        )}
                        {studyResults[label.label_number] === false && (
                          <div className="w-6 h-6 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full flex items-center justify-center">
                            <X className="w-4 h-4 text-[var(--foreground)]" />
                          </div>
                        )}
                      </div>
                      
                      <input
                        id={`study-input-${label.label_number}`}
                        type="text"
                        placeholder="Enter your answer..."
                        value={studyAnswers[label.label_number] || ''}
                        onChange={(e) => handleStudyAnswerChange(label.label_number, e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-150 bg-[var(--background)] text-[var(--foreground)] text-sm h-10"
                      />
                      
                      {studyResults[label.label_number] !== undefined && (
                        <div className={`mt-2 inline-block max-w-[200px] px-2 py-1 rounded-md border ${
                          studyResults[label.label_number] 
                            ? 'bg-[#80EF80]/20 border-[#80EF80]' 
                            : 'bg-red-500/20 border-red-500/40'
                        }`}>
                          <p className={`text-xs mb-1 ${
                            studyResults[label.label_number] 
                              ? 'text-green-700 dark:text-green-300' 
                              : 'text-red-700 dark:text-red-300'
                          }`}>Correct answer:</p>
                          <p className={`text-sm font-medium break-words ${
                            studyResults[label.label_number] 
                              ? 'text-green-800 dark:text-green-200' 
                              : 'text-red-800 dark:text-red-200'
                          }`}>{label.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>


              </div>
            </div>

            {/* Image Area - Right Side */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
                {/* Check Answers Button - Top Right of Panel */}
                {!isComplete && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={checkStudyAnswers}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-150 text-white border"
                      style={{
                        backgroundColor: 'var(--theme-check-button-bg)',
                        borderColor: 'var(--theme-check-button-border)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--theme-check-button-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--theme-check-button-bg)';
                      }}
                    >
                      Check Answers
                    </button>
                  </div>
                )}
                
                <div className="relative">
                  <img
                    src={selectedDiagram.image_url}
                    alt={selectedDiagram.title}
                    className="w-full h-auto max-h-[600px] object-contain rounded-lg border border-[var(--border)]"
                  />
                  

                  
                  {/* Render labels */}
                  {selectedDiagram.labels?.map(label => (
                    <div
                      key={label.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${label.x_position}%`, top: `${label.y_position}%` }}
                    >
                      <div 
                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg cursor-pointer hover:bg-red-600 transition-colors"
                        onClick={() => {
                          const inputElement = document.getElementById(`study-input-${label.label_number}`);
                          if (inputElement) {
                            inputElement.focus();
                            inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                      >
                        {label.label_number}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }

  return null;
}
