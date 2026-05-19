"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 glass-panel px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile hamburger menu placeholder */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 bg-transparent text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm"
            placeholder="Search quotations, shipments, or mitra..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-white">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" aria-hidden="true" />

          {/* Profile dropdown Placeholder */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 flex items-center justify-center text-sm font-medium text-white shadow-lg">
                AD
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="text-sm font-medium leading-6 text-white" aria-hidden="true">
                  Admin
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
