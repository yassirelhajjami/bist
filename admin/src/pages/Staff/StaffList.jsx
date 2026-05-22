import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ConfirmDialog from '../../components/UI/ConfirmDialog'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function StaffList() {
  const toast = useToast()
  const { t } = useLanguage()
  const s = t.staff
  const [staff, setStaff]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('staff').select('*').order('order_index').order('name')
    setStaff(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    setDeleting(true)
    await supabase.from('staff').delete().eq('id', deleteId)
    toast(t.common.success, 'success')
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  async function toggleActive(id, current) {
    await supabase.from('staff').update({ is_active: !current }).eq('id', id)
    setStaff(prev => prev.map(m => m.id === id ? { ...m, is_active: !current } : m))
    toast(t.common.success, 'success')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{s.title}</h1>
          <p className="text-slate-500 text-sm">{staff.length} {s.title.toLowerCase()}</p>
        </div>
        <Link to="/staff/new" className="btn btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {s.addMember}
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
      ) : staff.length === 0 ? (
        <div className="card flex flex-col items-center justify-center h-48 text-slate-400">
          <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <p className="text-sm">{s.noMembers}</p>
          <Link to="/staff/new" className="btn btn-primary btn-sm mt-3">{s.addFirst}</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {staff.map(member => (
            <div key={member.id} className={`card p-5 flex flex-col gap-3 ${!member.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-xl shrink-0">
                    {member.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{member.name}</p>
                  <p className="text-crimson-600 text-sm truncate">{member.role}</p>
                </div>
              </div>
              {member.bio && <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{member.bio}</p>}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                <button onClick={() => toggleActive(member.id, member.is_active)}
                  className={`badge cursor-pointer text-xs ${member.is_active ? 'badge-green' : 'badge-gray'}`}>
                  {member.is_active ? t.common.active : t.common.inactive}
                </button>
                <div className="flex gap-1">
                  <Link to={`/staff/${member.id}/edit`} className="btn btn-ghost btn-icon btn-sm text-slate-500 hover:text-navy-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </Link>
                  <button onClick={() => setDeleteId(member.id)} className="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title={s.deleteTitle} message={s.deleteMsg} />
    </div>
  )
}
