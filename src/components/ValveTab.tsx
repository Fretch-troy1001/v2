import React from 'react';
import { Database, Search, Filter, Download } from 'lucide-react';

export const ValveTab: React.FC = () => {
  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Data Explorer</h2>
          <p className="text-slate-500">Analyze and query your Nexus data repositories.</p>
        </div>
        <div className="flex gap-3">
          <button className="nexus-btn-ghost flex items-center gap-2">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="nexus-btn-solid flex items-center gap-2">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option>All Categories</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Archived</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Resource Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Last Modified</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">#NX-00{i}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">Placeholder Resource Item {i}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      i % 3 === 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {i % 3 === 0 ? 'Pending' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">Oct {10 + i}, 2025</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 font-medium hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>Showing 6 of 128 results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">Next</button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center">
          <Database size={20} />
        </div>
        <div>
          <div className="text-sm font-bold text-blue-900">Database Connection Active</div>
          <div className="text-xs text-blue-700">Latency: 24ms · Region: us-east-1 · SSL Enabled</div>
        </div>
      </div>
    </div>
  );
};
