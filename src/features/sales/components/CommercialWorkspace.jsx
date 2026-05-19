import Link from "next/link";
import MobileDataCard from "@/components/ui/MobileDataCard";

export default function CommercialWorkspace({
  eyebrow,
  title,
  description,
  stats,
  records,
  columns,
  actionHref,
  actionLabel,
  panels = [],
}) {
  const highlightedRecord = records[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary-300">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">{description}</p>
          </div>
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500"
          >
            {actionLabel}
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-primary-300">{stat.change}</p>
          </div>
        ))}
      </section>

      <section className="glass-panel rounded-3xl p-4 md:p-5">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-1 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Aktivitas Terbaru</h2>
            <p className="mt-1 text-sm text-slate-400">Daftar ini disiapkan untuk transisi ke data live dari domain commercial.</p>
          </div>
        </div>

        <div className="mt-4 hidden overflow-hidden lg:block">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-3 py-3 font-medium">Dokumen</th>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-3 font-medium">{column}</th>
                ))}
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-white/5 text-sm text-slate-200 last:border-b-0">
                  <td className="px-3 py-4">
                    <div className="font-medium text-white">{record.title}</div>
                    <div className="mt-1 text-xs text-slate-400">{record.subtitle}</div>
                  </td>
                  {record.rowCells.map((cell) => (
                    <td key={`${record.id}-${cell}`} className="px-3 py-4 text-slate-300">{cell}</td>
                  ))}
                  <td className="px-3 py-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white">
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:hidden">
          {records.map((record) => (
            <MobileDataCard
              key={record.id}
              title={record.title}
              subtitle={record.subtitle}
              status={record.status}
              statusColor={record.statusColor}
              details={record.details}
            />
          ))}
        </div>
      </section>

      {panels.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
          <div className="glass-panel rounded-3xl p-5">
            <h2 className="text-lg font-semibold text-white">Quotation Readiness</h2>
            <p className="mt-1 text-sm text-slate-400">Ringkasan quotation aktif yang paling dekat diteruskan ke operations dan finance.</p>

            {highlightedRecord?.summary ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{highlightedRecord.title}</p>
                    <p className="text-sm text-slate-400">{highlightedRecord.summary.customer}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-xs font-medium text-white">
                    {highlightedRecord.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-black/10 px-3 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Mode</p>
                    <p className="mt-1 text-sm text-white">{highlightedRecord.summary.mode}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-black/10 px-3 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Cargo</p>
                    <p className="mt-1 text-sm text-white">{highlightedRecord.summary.cargo}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-primary-500/20 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
                  {highlightedRecord.summary.nextStep}
                </div>
              </div>
            ) : null}
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <h2 className="text-lg font-semibold text-white">Flow Checkpoints</h2>
            <div className="mt-4 space-y-4">
              {panels.map((panel) => (
                <section key={panel.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-sm font-semibold text-white">{panel.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{panel.description}</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {panel.items.map((item) => (
                      <li key={item} className="rounded-xl border border-white/5 bg-black/10 px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}