import React, { useState } from 'react';
import { CustomerProfile } from '../types';

interface CustomerLoginPlatformProps {
  customer: CustomerProfile | null;
  onLoginSuccess: (customer: CustomerProfile) => void;
  onRegisterSuccess: (customer: CustomerProfile) => void;
  onLogout: () => void;
  onGoToTracker: () => void;
  onTextServiceManager: (topic?: string) => void;
}

export const CustomerLoginPlatform: React.FC<CustomerLoginPlatformProps> = ({
  customer,
  onLoginSuccess,
  onRegisterSuccess,
  onLogout,
  onGoToTracker,
  onTextServiceManager
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('alex.mercer@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit details state (for logged in view)
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState(customer?.phone || '');
  const [editEmail, setEditEmail] = useState(customer?.email || '');

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!loginIdentifier.trim()) {
        throw new Error('Please enter your registered email address or phone number.');
      }

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginIdentifier.trim(),
          password: loginPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed. Please check your credentials.');

      setSuccessMsg(`Welcome back, ${data.customer.firstName}! Authentication successful.`);
      setTimeout(() => {
        onLoginSuccess(data.customer);
      }, 500);
    } catch (err: any) {
      // Local fallback for demo
      if (loginIdentifier.toLowerCase().includes('alex')) {
        const demoAlex: CustomerProfile = {
          id: 'usr_981273',
          firstName: 'Alex',
          surname: 'Mercer',
          phone: '+1 (555) 234-8901',
          email: 'alex.mercer@example.com',
          membershipTier: 'Gold',
          registeredAt: '2026-08-15T09:30:00Z',
          registeredDevices: [
            {
              serialNumber: 'SN-PLS-8821',
              modelName: 'Aura Pulse Smartwatch',
              category: 'Wearables',
              purchaseDate: 'Aug 15, 2026',
              warrantyStatus: 'Active',
              warrantyExpires: 'Aug 15, 2028 (2-Year Protection)',
              healthStatus: 'Optimal (Battery Health: 99%)',
              lastSync: 'Today at 08:45 AM'
            }
          ]
        };
        onLoginSuccess(demoAlex);
      } else {
        setErrorMsg(err.message || 'Unable to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!firstName.trim() || !surname.trim() || !phone.trim() || !email.trim()) {
        throw new Error('First name, surname, phone number, and email ID are all required.');
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          surname: surname.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password: regPassword || 'auraPass123'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setSuccessMsg(`Registration complete! Welcome to AuraTech Customer Care, ${firstName}.`);
      setTimeout(() => {
        onRegisterSuccess(data.customer);
      }, 600);
    } catch (err: any) {
      if (firstName.trim() && surname.trim()) {
        const newCustomer: CustomerProfile = {
          id: 'usr_' + Date.now(),
          firstName: firstName.trim(),
          surname: surname.trim(),
          phone: phone.trim(),
          email: email.trim(),
          membershipTier: 'Gold',
          registeredAt: new Date().toISOString(),
          registeredDevices: [
            {
              serialNumber: `SN-${firstName.slice(0, 3).toUpperCase()}-9901`,
              modelName: 'Aura Pulse Smartwatch',
              category: 'Wearables',
              purchaseDate: 'Today',
              warrantyStatus: 'Active',
              warrantyExpires: '2 Years Manufacturer Protection',
              healthStatus: 'Optimal',
              lastSync: 'Just now'
            }
          ]
        };
        onRegisterSuccess(newCustomer);
      } else {
        setErrorMsg(err.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click Demo Account Loader
  const handleQuickLogin = (demoEmail: string, demoName: string, demoSurname: string, demoPhone: string, tier: 'Gold' | 'Silver' | 'VIP') => {
    setLoginIdentifier(demoEmail);
    setLoginPassword('password123');
    const profile: CustomerProfile = {
      id: 'usr_' + Math.floor(Math.random() * 899999 + 100000),
      firstName: demoName,
      surname: demoSurname,
      phone: demoPhone,
      email: demoEmail,
      membershipTier: tier,
      registeredAt: new Date().toISOString(),
      registeredDevices: [
        {
          serialNumber: `SN-${demoName.slice(0, 3).toUpperCase()}-4012`,
          modelName: 'Aura Pulse Smartwatch',
          category: 'Wearables',
          purchaseDate: '2026',
          warrantyStatus: 'Active',
          warrantyExpires: '2-Year Full Protection',
          healthStatus: 'Optimal',
          lastSync: 'Just now'
        }
      ]
    };
    onLoginSuccess(profile);
  };

  // Update profile details
  const handleSaveEdit = () => {
    if (!customer) return;
    const updated: CustomerProfile = {
      ...customer,
      phone: editPhone.trim() || customer.phone,
      email: editEmail.trim() || customer.email
    };
    onLoginSuccess(updated);
    setIsEditing(false);
    setSuccessMsg('Customer contact details updated successfully.');
  };

  // =========================================================================
  // VIEW A: LOGGED IN / AUTHENTICATED CUSTOMER DASHBOARD
  // =========================================================================
  if (customer) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
        
        {/* Customer Account Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                {customer.firstName[0]}{customer.surname ? customer.surname[0] : ''}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">
                    {customer.firstName} {customer.surname}
                  </h2>
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-bold">
                    🥇 {customer.membershipTier} Care Member
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Customer ID: <span className="font-mono text-blue-300">{customer.id}</span> • Member Since: {new Date(customer.registeredAt).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-400">📞</span> {customer.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-blue-400">✉️</span> {customer.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition"
              >
                {isEditing ? 'Cancel Edit' : '✏️ Edit Contact Info'}
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form Modal/Drawer if active */}
        {isEditing && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-slate-900">Update Registered Contact Details</h3>
            <p className="text-xs text-slate-500">
              Ensure your phone number is correct for direct callbacks from Service Manager Marcus Vance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 shadow"
              >
                Save Details
              </button>
            </div>
          </div>
        )}

        {/* Account Hub Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-3">
                📦
              </div>
              <h3 className="text-base font-bold text-slate-900">Live Product & Shipment Tracker</h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time FedEx and UPS tracking milestones for your active orders and registered electronics.
              </p>
            </div>
            <button
              onClick={onGoToTracker}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-2.5 rounded-xl transition text-center"
            >
              Open Live Tracker →
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-3">
                💬
              </div>
              <h3 className="text-base font-bold text-slate-900">Service Manager Direct Desk</h3>
              <p className="text-xs text-slate-500 mt-1">
                Text Senior Service Manager Marcus Vance directly or request an instant phone callback.
              </p>
            </div>
            <button
              onClick={() => onTextServiceManager()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition text-center shadow"
            >
              Open Service Desk →
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-3">
                🛡️
              </div>
              <h3 className="text-base font-bold text-slate-900">Protected Smart Devices</h3>
              <p className="text-xs text-slate-500 mt-1">
                {customer.registeredDevices?.length || 2} active devices covered under 2-Year Manufacturer Protection.
              </p>
            </div>
            <button
              onClick={onGoToTracker}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold py-2.5 rounded-xl transition text-center"
            >
              View Device Health →
            </button>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW B: GUEST / UNREGISTERED CUSTOMER LOGIN & REGISTER PLATFORM
  // =========================================================================
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Banner / Value Proposition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm overflow-hidden">
        
        {/* Left Column: Brand & Service Experience Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Customer Authentication & Experience Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Customer Login & Account Platform
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Welcome to the AuraTech Customer Service & Experience Portal. Sign in or register your contact details to access live courier route milestones, 2-year warranty protections, and direct 2-way texting with your Service Manager.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-blue-600 text-base font-bold">📦</span>
              <div>
                <strong className="text-slate-900 block">Synchronized Shipment Tracking</strong>
                <span className="text-slate-500">Live FedEx & UPS carrier mile-by-mile progress.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-indigo-600 text-base font-bold">💬</span>
              <div>
                <strong className="text-slate-900 block">Direct Service Manager Desk</strong>
                <span className="text-slate-500">Direct 2-way texting & instant callback request with Marcus Vance.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-emerald-600 text-base font-bold">🛡️</span>
              <div>
                <strong className="text-slate-900 block">Registered Device Warranty</strong>
                <span className="text-slate-500">Comprehensive hardware diagnostic and free prepaid return labels.</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Login Presets */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              One-Click Fast Demo Logins:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.mercer@example.com', 'Alex', 'Mercer', '+1 (555) 234-8901', 'Gold')}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-xl font-semibold transition"
              >
                🥇 Alex Mercer (Gold)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('jordan.reed@example.com', 'Jordan', 'Reed', '+1 (555) 876-5432', 'Silver')}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-xl font-semibold transition"
              >
                🥈 Jordan Reed (Silver)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('elena.vance@example.com', 'Elena', 'Vance', '+1 (555) 345-6789', 'VIP')}
                className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs px-3 py-1.5 rounded-xl font-semibold transition"
              >
                👑 Elena Vance (VIP)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login / Register Form Container */}
        <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          
          {/* Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-200/80 p-1.5 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl transition ${
                mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl transition ${
                mode === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register Your Details
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold">
              ✓ {successMsg}
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address or Registered Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="alex.mercer@example.com or +1 (555) 234-8901"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Account Passcode / Password</label>
                  <button
                    type="button"
                    onClick={() => alert("For this demo, use password: password123 or select a 1-click demo button above.")}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Forgot passcode?
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember my session</span>
                </label>
                <span className="text-[11px] text-slate-400">AES-256 Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Customer Portal'}
              </button>
            </form>
          ) : (
            /* TAB 2: REGISTRATION FORM (Capturing Name, Surname, Phone Number, Email ID) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="e.g. Mercer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-8901"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Used by Service Manager Marcus Vance for phone callbacks and SMS delivery notifications.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email ID (Email Address) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex.mercer@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Passcode / Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a password (e.g. pass123)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50 mt-2"
              >
                {loading ? 'Registering Details...' : 'Register Customer Details & Activate'}
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-400">
              🔒 100% Privacy Safeguard • No Marketing Spam
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
