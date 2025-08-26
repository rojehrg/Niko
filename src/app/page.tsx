"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, BookOpen, Target, Zap, Star, ArrowRight, CheckCircle } from "lucide-react";

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
    // Store the selected subject and redirect to dashboard
    localStorage.setItem('selectedSubject', subject);
    localStorage.setItem('userData', JSON.stringify(signupData));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Niko
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your personal learning and productivity hub. Get started with personalized study plans and stay motivated with SMS reminders.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {step === 'signup' ? (
              /* Signup Form */
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Get Started with Niko
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Join thousands of students already using Niko to boost their productivity
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      We'll send you study reminders and motivation via SMS
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      For account recovery and important updates
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Setting up your account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Continue to Subject Selection</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </form>

                {/* Features */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Smart Reminders</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get SMS notifications for exams and study sessions</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Zap className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Personalized Learning</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Content tailored to your chosen subjects</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Progress Tracking</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your achievements and stay motivated</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Subject Selection */
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    What are you studying?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Choose your subjects to personalize your learning experience
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { id: 'computer-science', name: 'Computer Science', emoji: '💻', color: 'blue' },
                    { id: 'biology', name: 'Biology', emoji: '🧬', color: 'green' },
                    { id: 'chemistry', name: 'Chemistry', emoji: '⚗️', color: 'purple' },
                    { id: 'physics', name: 'Physics', emoji: '⚡', color: 'yellow' },
                    { id: 'mathematics', name: 'Mathematics', emoji: '📐', color: 'red' },
                    { id: 'english', name: 'English', emoji: '📚', color: 'indigo' },
                    { id: 'history', name: 'History', emoji: '🏛️', color: 'orange' },
                    { id: 'psychology', name: 'Psychology', emoji: '🧠', color: 'pink' },
                    { id: 'economics', name: 'Economics', emoji: '💰', color: 'emerald' }
                  ].map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => handleSubjectSelect(subject.id)}
                      className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-center group hover:scale-105"
                    >
                      <div className="text-4xl mb-2">{subject.emoji}</div>
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {subject.name}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Don't see your subject? You can add more later in your dashboard.
                  </p>
                  <button
                    onClick={() => handleSubjectSelect('general')}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>Skip for now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
