"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LogOut, Truck } from "lucide-react";
import { clsx } from "clsx";
import { desktopNavigation } from "@/config/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full glass-panel flex flex-col border-r-0 border-white/10 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      {/* Logo */}
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">BUMI</span>
      </div>

      {/* Branch Info (RBAC Context) */}
      <div className="px-6 mb-6">
        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <p className="text-xs text-slate-400 font-medium">Cabang Aktif</p>
          <p className="text-sm font-semibold text-white mt-0.5 flex items-center">
            Jakarta Utara <span className="w-2 h-2 rounded-full bg-green-500 ml-2 animate-pulse" />
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-thin">
        {desktopNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary-500/20 text-primary-400 border border-primary-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                className={clsx(
                  "mr-3 flex-shrink-0 h-5 w-5 transition-transform duration-200",
                  isActive ? "text-primary-400 scale-110" : "text-slate-400 group-hover:text-white"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto border-t border-white/10">
        <div className="space-y-1">
          <Link
            href="/settings"
            className="group flex items-center px-3 py-2.5 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 group-hover:text-white" />
            Settings
          </Link>
          <button className="w-full group flex items-center px-3 py-2.5 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-200">
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-400" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
