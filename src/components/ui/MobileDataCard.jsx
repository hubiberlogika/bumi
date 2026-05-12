import { clsx } from "clsx";

export default function MobileDataCard({ title, subtitle, status, statusColor, details, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={clsx(
        "glass-card rounded-2xl p-4 w-full flex flex-col gap-3",
        onClick && "cursor-pointer active:scale-[0.98]"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white text-base leading-tight">{title}</h3>
          {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {status && (
          <span className={clsx(
            "px-2.5 py-1 rounded-full text-xs font-medium border",
            statusColor === "green" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
            statusColor === "blue" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
            statusColor === "yellow" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
            "bg-slate-500/10 text-slate-400 border-slate-500/20"
          )}>
            {status}
          </span>
        )}
      </div>

      {/* Details List */}
      {details && details.length > 0 && (
        <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-y-2 gap-x-4">
          {details.map((detail, idx) => (
            <div key={idx}>
              <p className="text-xs text-slate-500 font-medium">{detail.label}</p>
              <p className="text-sm font-medium text-slate-200 mt-0.5">{detail.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
