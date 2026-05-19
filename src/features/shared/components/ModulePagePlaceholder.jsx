const sectionStyles = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  planned: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  ready: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

export default function ModulePagePlaceholder({ eyebrow, title, description, sections = [] }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary-300">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <section key={section.title} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{section.description}</p>
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${sectionStyles[section.status] || sectionStyles.planned}`}>
                {section.label || section.status}
              </span>
            </div>
            {section.items?.length ? (
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {section.items.map((item) => (
                  <li key={item} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
