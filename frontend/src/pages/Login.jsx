import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loggedInUser = await login(email, password);
    navigate(`/${loggedInUser.role}`);
  };

  const handleQuickLogin = async (selectedRole) => {
    setEmail(`${selectedRole}@college.edu`);
    const loggedInUser = await login(`${selectedRole}@college.edu`, 'password123');
    navigate(`/${loggedInUser.role}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow accent decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-xl shadow-indigo-500/30 mb-4">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Smart-Schedule</h1>
          <p className="text-xs text-indigo-400 font-semibold tracking-wide uppercase mt-1">
            Automatic Timetable Generator
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Department of Computer Engineering Dashboard Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@college.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Login to Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick One-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="py-1.5 px-2 bg-indigo-950/40 border border-indigo-800/40 hover:border-indigo-500 rounded-lg text-[11px] font-semibold text-indigo-300 transition-all cursor-pointer text-center"
            >
              Demo Admin
            </button>
            <button
              onClick={() => handleQuickLogin('teacher')}
              className="py-1.5 px-2 bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500 rounded-lg text-[11px] font-semibold text-emerald-300 transition-all cursor-pointer text-center"
            >
              Demo Teacher
            </button>
            <button
              onClick={() => handleQuickLogin('student')}
              className="py-1.5 px-2 bg-amber-950/40 border border-amber-800/40 hover:border-amber-500 rounded-lg text-[11px] font-semibold text-amber-300 transition-all cursor-pointer text-center"
            >
              Demo Student
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
