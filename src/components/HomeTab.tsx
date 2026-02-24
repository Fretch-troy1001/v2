import React from 'react';
import { Calendar, Users, Clock, AlertTriangle, CheckCircle2, Activity, MapPin, FileText } from 'lucide-react';

export const HomeTab: React.FC = () => {
  return (
    <div className="log-page">
      {/* Header Section */}
      <div className="log-header">
        <div className="log-header__meta w-full">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="tag tag--amber">Medium Outage</span>
                <span className="tag tag--muted">Unit 2</span>
              </div>
              <h2 className="log-title text-2xl mb-1">GN Power Dinginin — Daily Outage Report</h2>
              <div className="log-date flex items-center gap-4 text-[var(--text-secondary)]">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 22 February 2026</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Day 0</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Mariveles</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--text-secondary)]">NMES FSE DS: Ralf Klug / Jacques Erasmus</div>
              <div className="text-sm text-[var(--text-secondary)]">NMES FSE NS: Kenny Cartwright / Anthony Ponce</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">NMES Personnel</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--accent)]" /> 12
          </div>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">PZ Personnel</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--text-dim)]" /> 35
          </div>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Planned Start</div>
          <div className="text-lg font-mono font-bold">23/02/2026</div>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Planned End</div>
          <div className="text-lg font-mono font-bold">25/03/2026</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Critical Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Comments */}
          <div className="log-section">
            <div className="log-section__title flex items-center gap-2">
              <FileText className="w-4 h-4" /> Comments
            </div>
            <ul className="space-y-3 text-sm text-[var(--text)]">
              <li className="flex gap-3">
                <span className="text-[var(--accent)]">•</span>
                <span>Inspect ITH gear. Validity sticker on ITH pump showed expiry date Jan 2026. According to GNPD, the ITH equipment is valid and current with certifications. Will fix the sticker issue – <span className="font-bold text-[var(--accent)]">IN PROGRESS</span>.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent)]">•</span>
                <span>Inspect special tools. The lifting beam certificate is pending from Plant – <span className="font-bold text-[var(--accent)]">IN PROGRESS</span>.</span>
              </li>
            </ul>
          </div>

          {/* Delay Tracker */}
          <div className="log-section">
            <div className="log-section__title flex items-center gap-2 text-[var(--danger)]">
              <AlertTriangle className="w-4 h-4" /> Delay Tracker
            </div>
            <ul className="space-y-3 text-sm text-[var(--text)]">
              <li className="flex gap-3">
                <span className="text-[var(--danger)]">•</span>
                <span>PTW for turbine scope and valve scope is expected to be received on 23/02/2026 00:00H. Cr (VI) decontamination may affect the schedule.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--danger)]">•</span>
                <span>Valve stroking activity is postponed to 23/02/2026, as for not to interrupt with forced air cooling, and also to ensure Cr (VI) decontamination completed.</span>
              </li>
            </ul>
          </div>

          {/* Steam Turbine Scope */}
          <div className="log-section">
            <div className="log-section__title flex items-center gap-2">
              <Activity className="w-4 h-4" /> Steam Turbine Scope
            </div>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Inspect lifting gear</span>
                <span className="tag tag--amber">In Progress</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>3rd office container lifted to turbine deck. Power supply connected</span>
                <span className="tag tag--success">Completed</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Toolbox talk with all PZ person regarding Cr6</span>
                <span className="tag tag--success">DONE</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Decontamination briefing for Insulators/Scaffolders (Entry/Exit/Disposal)</span>
                <span className="tag tag--success">DONE</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Insulators open more insulation on valves</span>
                <span className="tag tag--success">DONE</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Scaffolders to build scaffold on LHS at valves</span>
                <span className="tag tag--amber">ONGOING</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Cr6 consumables cleared and come to site</span>
                <span className="tag tag--success">RECEIVED</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Take temp readings on all valves (IP high on L/R, HP OK)</span>
                <span className="tag tag--success">DONE</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Remove insulation on inspection holes (HP Done, IP Remaining)</span>
                <span className="tag tag--amber">ONGOING</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Insulation removal on expansion joints for X-over pipes</span>
                <span className="tag tag--amber">ONGOING</span>
              </li>
              <li className="flex justify-between items-start">
                <span>Decontamination on HP CV and SV (Left & Right)</span>
                <span className="tag tag--amber">ONGOING</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Column: Other Scopes */}
        <div className="space-y-6">
          
          {/* HSE */}
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-xs font-bold text-[var(--success)] uppercase tracking-widest mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> HSE
            </div>
            <p className="text-sm text-[var(--text)]">
              Toolbox talk: How to treat Cr6 contaminated area and the use of PPE.
            </p>
          </div>

          {/* Offsite Machining */}
          <div className="log-section">
            <div className="log-section__title">Offsite Machining</div>
            <ul className="space-y-3 text-sm text-[var(--text)]">
              <li className="pl-3 border-l-2 border-[var(--accent)]">
                <div className="font-bold text-xs uppercase text-[var(--text-secondary)] mb-1">MSV Seal Ring</div>
                Pre machining. 1 x MCV seal ring turned, bored, 48-degree angle & parted off.
              </li>
              <li className="pl-3 border-l-2 border-[var(--accent)]">
                <div className="font-bold text-xs uppercase text-[var(--text-secondary)] mb-1">MCV Seal Ring</div>
                Pre machining. 1 x MSV seal ring turned, bored, 48-degree angle & parted off.
              </li>
              <li className="pl-3 border-l-2 border-[var(--accent)]">
                <div className="font-bold text-xs uppercase text-[var(--text-secondary)] mb-1">OLV Seal Ring</div>
                Pre machining. 1 x OLV seal ring turned & bored.
              </li>
            </ul>
          </div>

          {/* Generator */}
          <div className="log-section">
            <div className="log-section__title">Generator Scope</div>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Prep of Vacuum Pump Machine</span>
                <span className="tag tag--amber">ONGOING</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>H2 De-gassing</span>
                <span className="tag tag--success">COMPLETED</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>CO2 purging & air filling</span>
                <span className="tag tag--success">COMPLETED</span>
              </li>
              <li className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <span>Generator leak testing (24 hrs)</span>
                <span className="tag tag--amber">ONGOING</span>
              </li>
              <li className="flex justify-between items-start">
                <span>Scaffolding erection</span>
                <span className="tag tag--amber">ONGOING</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div style={{ marginTop: '28px', padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '12px', color: 'var(--text-dim)' }}>
        Generated from Daily Outage Report · NMES/OPN/SPNOMAC | Internal -001/FM-001 Rev. 01
      </div>
    </div>
  );
};
