'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, CalendarDays, Users, ShoppingBag } from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Home',    icon: LayoutDashboard },
  { href: '/goals/new', label: 'Goals',   icon: Target },
  { href: '/plan',      label: 'Plan',    icon: CalendarDays },
  { href: '/friends',   label: 'Friends', icon: Users },
  { href: '/store',     label: 'Store',   icon: ShoppingBag },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-surface-200">
      <main>{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-100/90 backdrop-blur-md border-t border-white/5">
        <div className="max-w-lg mx-auto flex items-stretch">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                  active ? 'text-lime-400' : 'text-white/25 hover:text-white/50'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                <span className={`font-body text-[9px] uppercase tracking-widest ${active ? 'text-lime-400' : 'text-white/25'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="h-safe-bottom" />
      </nav>
    </div>
  );
}
