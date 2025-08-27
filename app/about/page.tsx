import React from 'react';
import { Navigation } from '@/components/Navigation';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#1e3c72_0%,#2a5298_100%)]">
      <Navigation />
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[rgba(20,20,30,0.9)] backdrop-blur-md rounded-xl border border-white/10 p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-6">About Topics Graph</h1>
            
            <div className="space-y-6 text-white/90">
              <p className="text-lg leading-relaxed">
                Topics Graph is an interactive visualization tool that helps you explore and understand 
                the relationships between different topics in news articles and discussions.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sky-300 font-semibold mb-2">Community Detection</h3>
                  <p className="text-sm">
                    Uses advanced clustering algorithms like Leiden and Louvain to identify 
                    topic communities and their relationships.
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sky-300 font-semibold mb-2">Interactive Exploration</h3>
                  <p className="text-sm">
                    Click on nodes to see detailed insights, hover for quick previews, 
                    and adjust visualization parameters in real-time.
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sky-300 font-semibold mb-2">Real-time Data</h3>
                  <p className="text-sm">
                    Connect to live APIs to analyze current topics and trends across 
                    various themes like finance, politics, and technology.
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sky-300 font-semibold mb-2">Customizable Analysis</h3>
                  <p className="text-sm">
                    Adjust similarity thresholds, clustering parameters, and visual 
                    settings to fine-tune your analysis.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-sky-300 font-semibold mb-3">How it Works</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Select a theme and date range for analysis</li>
                  <li>The system processes articles and extracts key topics</li>
                  <li>Topics are clustered into communities using graph algorithms</li>
                  <li>The force-directed graph visualizes relationships and similarities</li>
                  <li>Interact with the visualization to explore insights</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
