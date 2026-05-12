"use client";

import { Package, Truck, Receipt, TrendingUp } from "lucide-react";
import MobileDataCard from "@/components/ui/MobileDataCard";

const stats = [
  { name: "Total Shipments", value: "142", change: "+12%", icon: Truck, trend: "up" },
  { name: "Active Contracts", value: "28", change: "+4%", icon: Package, trend: "up" },
  { name: "Unpaid Invoices", value: "Rp 124.5M", change: "-2%", icon: Receipt, trend: "down" },
  { name: "Monthly Revenue", value: "Rp 450.2M", change: "+18%", icon: TrendingUp, trend: "up" },
];

const recentShipments = [
  {
    id: "SHP-10042",
    client: "PT Maju Bersama",
    status: "In Transit",
    statusColor: "blue",
    origin: "Jakarta",
    destination: "Surabaya",
    date: "24 Apr 2026",
  },
  {
    id: "SHP-10043",
    client: "CV Agro Nusantara",
    status: "Delivered",
    statusColor: "green",
    origin: "Semarang",
    destination: "Bandung",
    date: "23 Apr 2026",
  },
  {
    id: "SHP-10044",
    client: "PT Tekno Logistik",
    status: "Pending",
    statusColor: "yellow",
    origin: "Jakarta",
    destination: "Medan",
    date: "25 Apr 2026",
  },
];

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
        {stats.map((stat, index) => (
          <div key={index} className="glass-card rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-16 h-16 text-primary-400" />
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
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Shipments (Mobile Friendly List) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Shipments</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300 font-medium">View All</button>
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
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-primary-600 hover:bg-primary-500 transition-colors text-white font-medium text-sm">
              <span>Create New Shipment</span>
              <Truck className="w-4 h-4" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white font-medium text-sm border border-white/10">
              <span>Create Quotation</span>
              <Receipt className="w-4 h-4" />
            </button>
          </div>
          
          {/* Warehouse Capacity Mini */}
          <div className="glass-card rounded-2xl p-5 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-slate-300">Warehouse Capacity</h3>
              <span className="text-xs text-primary-400 font-medium">75%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary-500 to-indigo-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">1,200 / 1,600 Pallets Used</p>
          </div>
        </div>
      </div>
    </div>
  );
}
