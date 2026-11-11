/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RefuelLogo } from '../components/common/RefuelLogo';

export const ForgotPasswordScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#050505] select-none">
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('login')}
          className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-white"
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>
        <RefuelLogo size="sm" />
      </div>

      <div className="my-auto py-6">
        {isSent ? (
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#C6FF00]/15 border border-[#C6FF00]/40 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} className="text-[#C6FF00]" />
            </div>
            <h3 className="font-athletic text-2xl font-bold uppercase text-white">
              Recovery Transmission Sent
            </h3>
            <p className="text-xs text-[#8A8A8A] mt-2 leading-relaxed">
              We have dispatched a secure passcode reset link to <span className="text-white font-mono">{email}</span>. Please verify your inbox.
            </p>
            <button
              onClick={() => setCurrentScreen('login')}
              className="mt-6 w-full h-11 rounded-xl bg-[#292929] hover:bg-[#333] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8A8A8A] block">
                Security Recovery
              </span>
              <h2 className="font-athletic text-3xl font-extrabold uppercase tracking-wide text-white mt-1">
                Reset Passcode
              </h2>
              <p className="text-xs text-[#8A8A8A] mt-1.5 leading-relaxed">
                Enter your registered athlete email to receive a secure link to update your credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono font-medium text-[#8A8A8A]">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-[#8A8A8A]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="athlete@domain.com"
                    className="w-full h-12 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#C6FF00]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-13 mt-2 rounded-xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(198,255,0,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? 'Dispatching...' : 'Send Recovery Link'}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="text-center pb-2">
        <p className="text-[11px] text-[#8A8A8A]">
          Need technical support? Contact support@refuel.app
        </p>
      </div>
    </div>
  );
};
