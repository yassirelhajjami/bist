export default function StatCard({ label, value, icon, color = 'navy', sub, trend }) {
  const colors = {
    navy:    { bg: 'bg-navy-900',    text: 'text-navy-600',    light: 'bg-navy-50' },
    crimson: { bg: 'bg-crimson-600', text: 'text-crimson-600', light: 'bg-crimson-50' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50' },
    amber:   { bg: 'bg-amber-500',   text: 'text-amber-600',   light: 'bg-amber-50' },
    blue:    { bg: 'bg-blue-600',    text: 'text-blue-600',    light: 'bg-blue-50' },
    purple:  { bg: 'bg-purple-600',  text: 'text-purple-600',  light: 'bg-purple-50' },
  }
  const c = colors[color] || colors.navy

  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`${c.light} rounded-xl w-12 h-12 flex items-center justify-center shrink-0`}>
        <span className={c.text}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-slate-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value ?? '—'}</p>
        {sub && <p className="text-slate-400 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  )
}
