'use client';

import Link from "next/link";
import { Settings, Zap, FileText, ListChecks, History } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { TokenDisplay } from '@/components/dashboard/TokenDisplay';

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: FileText },
  { name: "Plan", href: "/plan", icon: ListChecks },
  { name: "History", href: "/history", icon: History },
  { name: "Tokens", href: "/tokens", icon: Zap },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Tamoray AI
            </h1>
            <UserButton />
          </div>

          {/* Token Display */}
          <TokenDisplay />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${isActive
                    ? 'bg-slate-800 text-amber-400 border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-amber-400' : 'group-hover:text-amber-400'
                  }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            © 2024 Tamoray AI
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-slate-950">
        {children}
      </div>
    </div>
  );
}
