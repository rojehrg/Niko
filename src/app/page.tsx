"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, BookOpen, ArrowRight, User } from "lucide-react";

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
    // Store the selected subject and user data
    localStorage.setItem('selectedSubject', subject);
    localStorage.setItem('userData', JSON.stringify(signupData));
    localStorage.setItem('isAuthenticated', 'true');
    router.push('/dashboard');
  };

  const subjects = [
    { id: 'biology', name: 'Biology', emoji: '🧬🌱🔬🦠🧫🌿🧍' },
    { id: 'chemistry', name: 'Chemistry', emoji: '⚗️🧪🔥💨🧊🔮💥' },
    { id: 'physics', name: 'Physics', emoji: '⚡🌌🛰️🌠🔭🪐📡' },
    { id: 'mathematics', name: 'Mathematics', emoji: '📐➗🔢✖️➕📊📏' },
    { id: 'computer-science', name: 'Computer Science', emoji: '💻🤖📊📱🖥️🔧👨‍💻' },
    { id: 'english', name: 'English', emoji: '📚✍️📝📰🖋️📖📜' },
    { id: 'history', name: 'History', emoji: '📜🏛️🗿⚔️📯🏺⛩️' },
    { id: 'geography', name: 'Geography', emoji: '🌍🗺️⛰️🌊🏕️🏜️🏝️' },
    { id: 'economics', name: 'Economics', emoji: '💰📈🏦📉🪙💳🛒' },
    { id: 'psychology', name: 'Psychology', emoji: '🧠💭🔎📘🤯😌👥' },
    { id: 'art', name: 'Art', emoji: '🎨🖌️🖼️🖍️✏️🎭🪡' },
    { id: 'music', name: 'Music', emoji: '🎵🎶🎹🥁🎸🎤🎷' },
    { id: 'philosophy', name: 'Philosophy', emoji: '🤔📖⚖️💡🗣️🔍🌌' },
    { id: 'sociology', name: 'Sociology', emoji: '👥🌐🏘️🗣️🤝📊🧑‍🤝‍🧑' },
    { id: 'political-science', name: 'Political Science', emoji: '🏛️📊🗳️⚖️🌍📢✍️' },
    { id: 'engineering', name: 'Engineering', emoji: '🛠️🏗️⚙️🔩🔧🧱🚧' },
    { id: 'medicine', name: 'Medicine', emoji: '⚕️💉🩺🧪🫀🫁💊' },
    { id: 'law', name: 'Law', emoji: '⚖️📜👩‍⚖️👨‍⚖️🔍🏛️✍️' },
    { id: 'languages', name: 'Languages', emoji: '🌐🗣️✒️📖📝📚💬' },
    { id: 'astronomy', name: 'Astronomy', emoji: '🌌🔭🪐⭐🌙☄️🛰️' },
    { id: 'environmental-science', name: 'Environmental Science', emoji: '🌿🌎♻️🌱💧🌳☀️' },
    { id: 'anthropology', name: 'Anthropology', emoji: '🗿🌍👣🧑‍🤝‍🧑📜🏺⛏️' },
    { id: 'literature', name: 'Literature', emoji: '📖🖋️🎭📚📝📜📕' },
    { id: 'business', name: 'Business', emoji: '💼📊📉📈💳🏦📑' },
    { id: 'education', name: 'Education', emoji: '🎓📘✏️📚🏫📝📖' },
    { id: 'sports', name: 'Sports', emoji: '⚽🏀🏋️🎾🏈⚾🥇' }

    
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[var(--foreground)] rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[var(--background)]" />
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)]">
              Niko
            </h1>
          </div>
          <p className="text-lg text-[var(--foreground-secondary)] max-w-2xl mx-auto">
            Your personal learning and productivity hub. Get started with personalized study plans and stay motivated with SMS reminders.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
          {step === 'signup' ? (
            /* Signup Form */
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
                  Create Your Account
                </h2>
                <p className="text-[var(--foreground-secondary)]">
                  Join thousands of students already using Niko to boost their productivity
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--foreground-tertiary)]" />
                    <input
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--foreground)] transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <p className="text-xs text-[var(--foreground-tertiary)] mt-1">
                    This will be displayed throughout your personalized experience
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--foreground-tertiary)]" />
                    <input
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--foreground)] transition-all duration-200"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <p className="text-xs text-[var(--foreground-tertiary)] mt-1">
                    We'll send you SMS reminders for exams and study motivation
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--foreground-tertiary)]" />
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--foreground)] transition-all duration-200"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <p className="text-xs text-[var(--foreground-tertiary)] mt-1">
                    For account recovery and important updates
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Subject Selection */
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
                  Welcome, {signupData.name}! 👋
                </h2>
                <p className="text-[var(--foreground-secondary)]">
                  Choose your primary subject to personalize your learning experience
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject.id)}
                    className="p-4 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] hover:bg-[var(--hover)] transition-all duration-200 text-center group"
                  >
                    <div className="text-3xl mb-2">
                      {subject.emoji.split('').map((emoji, index) => (
                        <span key={index} className="inline-block">
                          {emoji}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)]">
                      {subject.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
