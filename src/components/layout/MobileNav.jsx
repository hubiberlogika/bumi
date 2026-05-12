"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, FileText, Settings } from "lucide-react";
import { clsx } from "clsx";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Ops", href: "/ops/tracking", icon: Truck },
  { name: "Sales", href: "/sales/prospects", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive ? "text-primary-400" : "text-slate-400 hover:text-white"
              )}
            >
              <item.icon
                className={clsx(
                  "h-5 w-5 transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
