"use client";

import Link from "next/link";
import { Building2, FileText, Receipt, TrendingUp, Truck } from "lucide-react";
import MobileDataCard from "@/components/ui/MobileDataCard";
import {
  dashboardFlowHighlights,
  dashboardStats,
  recentShipments,
} from "@/features/dashboard/data/dashboardData";

const statIcons = {
  quotation: FileText,
  mitra: Building2,
  invoice: Receipt,
  revenue: TrendingUp,
};

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Periode:</span>
          <select className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500">
            <option>Bulan Ini</option>
            <option>Bulan Lalu</option>
            <option>Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => {
          const Icon = statIcons[stat.icon] || Truck;

          return (
          <div key={stat.name} className="glass-card rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon className="w-16 h-16 text-primary-400" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-400">{stat.name}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        )})}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Shipments (Mobile Friendly List) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Shipments</h2>
            <Link href="/ops/shipments" className="text-sm text-primary-400 hover:text-primary-300 font-medium">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentShipments.map((shipment, idx) => (
              <MobileDataCard
                key={idx}
                title={shipment.id}
                subtitle={shipment.client}
                status={shipment.status}
                statusColor={shipment.statusColor}
                details={[
                  { label: "Route", value: `${shipment.origin} → ${shipment.destination}` },
                  { label: "Date", value: shipment.date }
                ]}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions or Info (Placeholder for P&L Chart or Activity) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Flow Checkpoints</h2>
          <div className="glass-panel rounded-2xl p-4 space-y-3">
            {dashboardFlowHighlights.map((highlight) => (
              <section key={highlight.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white">{highlight.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{highlight.description}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {highlight.items.map((item) => (
                    <li key={item} className="rounded-xl border border-white/5 bg-black/10 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-5 mt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-slate-300">Quick Actions</h3>
                <p className="mt-1 text-xs text-slate-500">Langsung masuk ke flow aktif yang dipakai saat ini.</p>
              </div>
              <span className="text-xs text-primary-400 font-medium">Live</span>
            </div>
            <div className="mt-4 space-y-3">
              <Link href="/sales/quotations" className="flex items-center justify-between rounded-xl bg-primary-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500">
                <span>Buka Quotation</span>
                <FileText className="h-4 w-4" />
              </Link>
              <Link href="/master/partners" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
                <span>Buka Mitra</span>
                <Building2 className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
