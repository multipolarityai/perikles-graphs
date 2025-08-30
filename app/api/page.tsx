import React from 'react';
import { Navigation } from '@/components/Navigation';

export default function APIPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#1e3c72_0%,#2a5298_100%)]">
      <Navigation />
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[rgba(20,20,30,0.9)] backdrop-blur-md rounded-xl border border-white/10 p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-6">API Documentation</h1>
            
            <div className="space-y-6 text-white/90">
              <p className="text-lg leading-relaxed">
                Access the Topics Graph API to integrate topic analysis into your applications.
              </p>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-sky-300 font-semibold mb-3">Endpoint</h3>
                <code className="bg-black/30 px-3 py-1 rounded text-green-300 text-sm">
                  POST /api/topics
                </code>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-sky-300 font-semibold mb-3">Request Parameters</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-4 py-2 border-b border-white/10">
                    <span className="font-medium text-sky-300">Parameter</span>
                    <span className="font-medium text-sky-300">Type</span>
                    <span className="font-medium text-sky-300">Description</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-1">
                    <code className="text-green-300">start_date</code>
                    <span className="text-yellow-300">string</span>
                    <span>Start date (YYYY-MM-DD)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-1">
                    <code className="text-green-300">end_date</code>
                    <span className="text-yellow-300">string</span>
                    <span>End date (YYYY-MM-DD)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-1">
                    <code className="text-green-300">theme</code>
                    <span className="text-yellow-300">string</span>
                    <span>Topic theme to analyze</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-1">
                    <code className="text-green-300">similarity_threshold</code>
                    <span className="text-yellow-300">number</span>
                    <span>Minimum similarity (0.0-1.0)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-1">
                    <code className="text-green-300">max_topics</code>
                    <span className="text-yellow-300">number</span>
                    <span>Maximum topics to return</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-sky-300 font-semibold mb-3">Example Request</h3>
                <pre className="bg-black/30 p-3 rounded text-sm overflow-x-auto">
{`{
  "start_date": "2025-08-26",
  "end_date": "2025-08-26",
  "theme": "Gold",
  "similarity_threshold": 0.3,
  "max_topics": 100,
  "clustering_algorithm": "leiden",
  "resolution": 1.0,
  "use_gpu": true
}`}
                </pre>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-sky-300 font-semibold mb-3">Response Format</h3>
                <pre className="bg-black/30 p-3 rounded text-sm overflow-x-auto">
{`{
  "nodes": [
    {
      "id": "topic_1",
      "label": "Gold Price Analysis",
      "community": 0,
      "articles": 42,
      "insights": ["Price volatility", "Market trends"],
      "description": "Analysis of gold market...",
      "theme": "Gold"
    }
  ],
  "links": [
    {
      "source": "topic_1",
      "target": "topic_2",
      "strength": 0.75,
      "type": "intra"
    }
  ],
  "metadata": {
    "algorithmUsed": "leiden",
    "modularityScore": 0.847,
    "processingTime": 2.3
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
