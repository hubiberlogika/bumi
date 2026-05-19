import {
  Building2,
  FileText,
  Home,
  Receipt,
  Settings,
  Truck,
} from "lucide-react";

export const desktopNavigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Quotations", href: "/sales/quotations", icon: FileText },
  { name: "Operations", href: "/ops/shipments", icon: Truck },
  { name: "Finance", href: "/finance/invoices", icon: Receipt },
  { name: "Mitra", href: "/master/partners", icon: Building2 },
];

export const mobileNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Quotation", href: "/sales/quotations", icon: FileText },
  { name: "Ops", href: "/ops/shipments", icon: Truck },
  { name: "Finance", href: "/finance/invoices", icon: Receipt },
  { name: "Mitra", href: "/master/partners", icon: Building2 },
  { name: "More", href: "/settings", icon: Settings },
];