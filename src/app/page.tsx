"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, BookOpen, ArrowRight, User, ChevronDown, ChevronUp } from "lucide-react";

interface SignupData {
  phone: string;
  email: string;
  name: string;
}

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'subjects'>('signup');
  const [signupData, setSignupData] = useState<SignupData>({
    phone: '',
    email: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.phone || !signupData.email || !signupData.name) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('subjects');
  };

  const handleSubjectSelect = (subject: string) => {
    // Store the selected subject and user data
    localStorage.setItem('selectedSubject', subject);
    localStorage.setItem('userData', JSON.stringify(signupData));
    localStorage.setItem('isAuthenticated', 'true');
    router.push('/dashboard');
  };

  const initialSubjects = [
    { id: 'computer-science', name: 'Computer Science' },
    { id: 'biology', name: 'Biology' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'physics', name: 'Physics' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'pa', name: 'Physician Assistant' }
  ];

  const allSubjects = [
    { id: 'computer-science', name: 'Computer Science' },
    { id: 'biology', name: 'Biology' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'physics', name: 'Physics' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'pa', name: 'Physician Assistant' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' },
    { id: 'economics', name: 'Economics' },
    { id: 'psychology', name: 'Psychology' },
    { id: 'art', name: 'Art' },
    { id: 'music', name: 'Music' },
    { id: 'sports', name: 'Sports' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'medicine', name: 'Medicine' },
    { id: 'law', name: 'Law' },
    { id: 'business', name: 'Business' },
    { id: 'architecture', name: 'Architecture' },
    { id: 'design', name: 'Design' }
  ];

  const displayedSubjects = showAllSubjects ? allSubjects : initialSubjects;

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-[var(--foreground)]">
              StudyBuddy
            </h1>
          </div>
          <p className="text-xl text-[var(--foreground-secondary)] max-w-xl mx-auto leading-relaxed">
            Your personal learning and productivity hub. Get started with personalized study plans and stay motivated with SMS reminders.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden">
          {step === 'signup' ? (
            /* Signup Form */
            <div className="p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[var(--foreground)] mb-3">
                  Create Your Account
                </h2>
                <p className="text-[var(--foreground-secondary)] text-lg">
                  Join thousands of students already using StudyBuddy to boost their productivity
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--foreground-tertiary)]" />
                    <input
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 border-2 border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--foreground)] transition-all duration-200 text-lg"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <p className="text-sm text-[var(--foreground-tertiary)] mt-2 ml-1">
                    This will be displayed throughout your personalized experience
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--foreground-tertiary)]" />
                    <input
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 border-2 border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--foreground)] transition-all duration-200 text-lg"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <p className="text-sm text-[var(--foreground-tertiary)] mt-2 ml-1">
                    We'll send you SMS reminders for exams and study motivation
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--foreground-tertiary)]" />
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 border-2 border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--foreground)] transition-all duration-200 text-lg"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <p className="text-sm text-[var(--foreground-tertiary)] mt-2 ml-1">
                    For account recovery and important updates
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Subject Selection */
            <div className="p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[var(--foreground)] mb-3">
                  Welcome, {signupData.name}! 👋
                </h2>
                <p className="text-[var(--foreground-secondary)] text-lg">
                  Choose your primary subject to personalize your learning experience
                </p>
              </div>

              <div className="space-y-3 max-w-lg mx-auto">
                {displayedSubjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject.id)}
                    className="w-full p-4 border-2 border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:bg-[var(--hover)] transition-all duration-200 text-left group hover:shadow-md"
                  >
                    <div className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] text-lg">
                      {subject.name}
                    </div>
                  </button>
                ))}
                
                <button
                  onClick={() => setShowAllSubjects(!showAllSubjects)}
                  className="w-full p-4 border-2 border-dashed border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:bg-[var(--hover)] transition-all duration-200 text-center group"
                >
                  <div className="flex items-center justify-center gap-2 text-[var(--foreground-secondary)] group-hover:text-[var(--primary)] font-medium">
                    {showAllSubjects ? (
                      <>
                        <ChevronUp className="w-5 h-5" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5" />
                        Show More Subjects
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
