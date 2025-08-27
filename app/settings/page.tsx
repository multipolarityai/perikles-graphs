import React from 'react';
import { Navigation } from '@/components/Navigation';

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#1e3c72_0%,#2a5298_100%)]">
      <Navigation />
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[rgba(20,20,30,0.9)] backdrop-blur-md rounded-xl border border-white/10 p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
            
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-sky-300 font-semibold mb-4">Default Parameters</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-2">Default Theme</label>
                    <select 
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white"
                      aria-label="Default Theme"
                    >
                      <option value="Global Economy">Global Economy</option>
                      <option value="Gold">Gold</option>
                      <option value="Crypto">Crypto</option>
                      <option value="AI">AI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/80 mb-2">Default Algorithm</label>
                    <select 
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white"
                      aria-label="Default Algorithm"
                    >
                      <option value="leiden">Leiden</option>
                      <option value="louvain">Louvain</option>
                      <option value="spectral">Spectral</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-sky-300 font-semibold mb-4">Visualization Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/90">Show labels by default</span>
                    <input type="checkbox" className="w-4 h-4" aria-label="Show labels by default" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/90">Auto-refresh data</span>
                    <input type="checkbox" className="w-4 h-4" aria-label="Auto-refresh data" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/90">Dark mode</span>
                    <input type="checkbox" className="w-4 h-4" defaultChecked aria-label="Dark mode" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-sky-300 font-semibold mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-2">Max Topics Limit</label>
                    <input 
                      type="number" 
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white" 
                      defaultValue={100}
                      min={10}
                      max={500}
                      aria-label="Max Topics Limit"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/90">Use GPU acceleration</span>
                    <input type="checkbox" className="w-4 h-4" defaultChecked aria-label="Use GPU acceleration" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-colors">
                  Save Settings
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
