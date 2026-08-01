import React from 'react';
import { Link } from 'react-router-dom';
import {
  User, Bell, Shield, CreditCard, ChevronRight,
  Palette, Globe, Lock, HelpCircle,
} from 'lucide-react';

const settingGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile', desc: 'Manage your personal information', to: '/profile' },
      { icon: Shield, label: 'Security', desc: 'Password and authentication settings', to: '#' },
      { icon: Bell, label: 'Notifications', desc: 'Control notification preferences', to: '/notifications' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Palette, label: 'Appearance', desc: 'Theme and display settings', to: '#' },
      { icon: Globe, label: 'Language & Region', desc: 'Language, timezone, and currency', to: '#' },
      { icon: CreditCard, label: 'Payment Methods', desc: 'Manage your payment options', to: '#' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: Lock, label: 'Privacy', desc: 'Privacy policy and data settings', to: '#' },
      { icon: HelpCircle, label: 'Help Center', desc: 'Get help with your account', to: '#' },
    ],
  },
];

const Settings = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      {settingGroups.map((group) => (
        <div key={group.title} className="rounded-2xl bg-[#151b27] border border-white/10 overflow-hidden">
          <div className="px-6 py-3 border-b border-white/5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{group.title}</h2>
          </div>
          <div className="divide-y divide-white/5">
            {group.items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors no-underline group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#C08A5D]/10">
                    <item.icon size={18} className="text-[#C08A5D]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-[#C08A5D] transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-[#C08A5D] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Settings;

