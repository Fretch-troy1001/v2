/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HomeTab } from './components/HomeTab';
import { ToolsTab } from './components/ToolsTab';
import { ValveTab } from './components/ValveTab';
import { 
  LayoutDashboard, 
  Settings, 
  Database, 
  Bell, 
  HelpCircle, 
  Plus, 
  ChevronRight,
  User,
  Mail,
  Phone
} from 'lucide-react';

type Tab = 'dashboard' | 'data' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <HomeTab />;
      case 'data': return <ValveTab />;
      case 'settings': return <ToolsTab />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* ── Navigation Sidebar ─────────────────────────── */}
      <aside className="nexus-sidebar">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <span className="text-white font-bold text-xl tracking-tight">NEXUS</span>
          </div>
        </div>

        <nav className="flex-1">
          <div 
            className={`nexus-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
            <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <div 
            className={`nexus-nav-item ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <Database size={18} />
            <span>Data Explorer</span>
          </div>
          <div 
            className={`nexus-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Admin User</span>
              <span className="text-xs text-slate-500">System Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Header */}
        <header className="nexus-header">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Nexus</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="nexus-btn-solid flex items-center gap-2">
              <Plus size={18} />
              <span>Create New</span>
            </button>
          </div>
        </header>

        {/* Main Stage + Details Panel */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            {renderContent()}
          </main>

          {/* Side Profile Cards (Right Panel) */}
          <aside className="nexus-details-panel">
            <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Details Panel</h3>
            
            {[1, 2, 3].map((i) => (
              <div key={i} className="nexus-profile-card">
                <div className="profile-card-header">
                  <div className="profile-avatar flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="profile-name">Placeholder Name {i}</div>
                    <div className="profile-subtext">Secondary Title Label</div>
                  </div>
                </div>
                <div className="profile-card-body">
                  <div className="profile-info-row">
                    <Mail size={14} />
                    <span>contact.placeholder@nexus.com</span>
                  </div>
                  <div className="profile-info-row">
                    <Phone size={14} />
                    <span>+1 (555) 000-000{i}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="text-sm font-bold text-blue-900 mb-2">System Status</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                All systems are currently operational. No maintenance scheduled for the next 24 hours.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
