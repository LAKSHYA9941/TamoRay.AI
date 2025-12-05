import Link from "next/link";
import { History, Settings, Zap ,FileText } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ReactNode } from 'react';

const navItems = [
  {name:"Dashboard", href:"/dashboard", icon:FileText},
  { name: "History", href: "/history", icon: History },
  { name: "Tokens", href: "/tokens", icon: Zap },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">Tamoray AI 
            <UserButton />
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-slate-950">
        {children}
      </div>
    </div>
  );
}
