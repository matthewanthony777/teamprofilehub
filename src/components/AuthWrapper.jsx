import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { useState } from 'react';

const AuthWrapper = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  const [showSignIn, setShowSignIn] = useState(true);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not signed in - show auth UI
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">SQC Employee Hub</h1>
            <p className="text-gray-400">Talent Management Platform</p>
          </div>

          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
            {showSignIn ? (
              <div>
                <SignIn
                  appearance={{
                    elements: {
                      rootBox: 'mx-auto w-full',
                      card: 'bg-transparent shadow-none p-0',
                      headerTitle: 'text-white text-xl',
                      headerSubtitle: 'text-gray-400',
                      socialButtonsBlockButton: 'bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#2a2a2a]',
                      socialButtonsBlockButtonText: 'text-white',
                      dividerLine: 'bg-[#2a2a2a]',
                      dividerText: 'text-gray-500',
                      formFieldLabel: 'text-gray-300',
                      formFieldInput: 'bg-[#0a0a0a] border-[#2a2a2a] text-white',
                      formButtonPrimary: 'bg-[#3b82f6] hover:bg-[#2563eb]',
                      footerActionLink: 'text-[#3b82f6] hover:text-[#2563eb]',
                      identityPreviewText: 'text-white',
                      identityPreviewEditButton: 'text-[#3b82f6]',
                    }
                  }}
                  routing="hash"
                />
                <div className="mt-4 pt-4 border-t border-[#2a2a2a] text-center">
                  <p className="text-sm text-gray-400">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setShowSignIn(false)}
                      className="text-[#3b82f6] hover:text-[#2563eb] font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <SignUp
                  appearance={{
                    elements: {
                      rootBox: 'mx-auto w-full',
                      card: 'bg-transparent shadow-none p-0',
                      headerTitle: 'text-white text-xl',
                      headerSubtitle: 'text-gray-400',
                      socialButtonsBlockButton: 'bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#2a2a2a]',
                      socialButtonsBlockButtonText: 'text-white',
                      dividerLine: 'bg-[#2a2a2a]',
                      dividerText: 'text-gray-500',
                      formFieldLabel: 'text-gray-300',
                      formFieldInput: 'bg-[#0a0a0a] border-[#2a2a2a] text-white',
                      formButtonPrimary: 'bg-[#3b82f6] hover:bg-[#2563eb]',
                      footerActionLink: 'text-[#3b82f6] hover:text-[#2563eb]',
                    }
                  }}
                  routing="hash"
                />
                <div className="mt-4 pt-4 border-t border-[#2a2a2a] text-center">
                  <p className="text-sm text-gray-400">
                    Already have an account?{' '}
                    <button
                      onClick={() => setShowSignIn(true)}
                      className="text-[#3b82f6] hover:text-[#2563eb] font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-xs text-gray-600">
            Secure authentication powered by Clerk
          </p>
        </div>
      </div>
    );
  }

  // Signed in - render children
  return children;
};

export default AuthWrapper;
