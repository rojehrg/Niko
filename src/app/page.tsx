"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, User, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";

interface SignupData {
  email: string;
  name: string;
  password: string;
}

export default function HomePage() {
  const router = useRouter();
  const { signUp, signIn, isAuthenticated, userProfile, updateProfile } = useAuth();
  const [step, setStep] = useState<'signup' | 'subjects'>('signup');
  const [isSignIn, setIsSignIn] = useState(false);
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    name: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if already authenticated (only on client)
  useEffect(() => {
    if (isClient && isAuthenticated && userProfile) {
      router.push('/dashboard');
    }
  }, [isClient, isAuthenticated, userProfile, router]);

  // Don't render anything until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden">
            <div className="p-10 text-center">
              <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[var(--foreground-secondary)]">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.email || !signupData.name || !signupData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signUp(signupData.email, signupData.password, {
        name: signupData.name,
        email: signupData.email,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Show success message and redirect to subjects
      setIsLoading(false);
      setStep('subjects');
    } catch (error) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.email || !signupData.password) {
      setError('Please fill in email and password');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(signupData.email, signupData.password);

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard on successful sign in
      router.push('/dashboard');
    } catch (error) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleSubjectSelect = async (subject: string) => {
    // Update user profile with selected subject
    if (userProfile) {
      await updateProfile({ selectedSubject: subject });
      router.push('/dashboard');
    }
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
        {/* Main Content */}
        <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden">
          {step === 'signup' ? (
            /* Signup/Signin Form */
            <div className="p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[var(--foreground)] mb-3">
                  {isSignIn ? 'Welcome Back' : 'Create Your Account'}
                </h2>
                <p className="text-lg text-[var(--foreground-secondary)]">
                  {isSignIn 
                    ? 'Sign in to continue your learning journey'
                    : 'Join thousands of students already using StudyBuddy to boost their productivity'
                  }
                </p>
              </div>

              {/* Toggle between signup and signin */}
              <div className="flex mb-8 bg-[var(--background)] rounded-lg p-1">
                <button
                  onClick={() => setIsSignIn(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    !isSignIn 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setIsSignIn(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    isSignIn 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={isSignIn ? handleSignIn : handleSignup} className="space-y-6 max-w-md mx-auto">
                {!isSignIn && (
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
                        required={!isSignIn}
                      />
                    </div>
                  </div>
                )}

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
                      className="w-full pl-12 pr-4 py-4 border-2 border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] transition-all duration-200 text-lg"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  {!isSignIn && (
                    <p className="text-xs text-[var(--foreground-tertiary)] mt-2 ml-1">
                      Your account will be created immediately - no email verification needed
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--foreground-tertiary)]" />
                    <input
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 border-2 border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-[var(--foreground)] transition-all duration-200 text-lg"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isSignIn ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {isSignIn ? 'Sign In' : 'Continue'}
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
                <p className="text-lg text-[var(--foreground-secondary)] mb-6">
                  Choose your primary subject to personalize your learning experience
                </p>
                <p className="text-[var(--foreground-secondary)] text-lg">
                  This will customize the floating emojis and organize your content
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
