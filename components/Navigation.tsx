'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { name: 'Topics Graph', href: '/', description: 'Interactive topic visualization' },
  { name: 'About', href: '/about', description: 'Learn about the project' },
  { name: 'API', href: '/api', description: 'API documentation' },
  { name: 'Settings', href: '/settings', description: 'Configuration options' },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-[rgba(20,20,30,0.95)] backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">TG</span>
          </div>
          <span className="text-white font-semibold text-lg">Topics Graph</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 ${
                  isActive 
                    ? 'text-sky-300 bg-white/10' 
                    : 'text-white/80 hover:text-white'
                }`}
                title={item.description}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            className="text-white/80 hover:text-white p-2"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            aria-label="Help and information"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button 
            className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            aria-label="Settings and preferences"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
