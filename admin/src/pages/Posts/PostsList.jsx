import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ConfirmDialog from '../../components/UI/ConfirmDialog'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

function fmt(date, lang) { return date ? new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—' }

export default function PostsList() {
  const toast = useToast()
  const { t, lang } = useLanguage()
  const p = t.posts
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const STATUS_BADGE = { published: 'badge-green', draft: 'badge-gray' }
  const STATUS_LABEL = { published: t.common.published, draft: t.common.draft }

  const load = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('posts').select('*').order('created_at', { ascending: false })
    if (status) q = q.eq('status', status)
    if (search) q = q.ilike('title', `%${search}%`)
    const { data } = await q
    setPosts(data || [])
    setLoading(false)
  }, [search, status])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase.from('posts').delete().eq('id', deleteId)
    if (error) toast(t.common.error, 'error')
    else { toast(t.common.success, 'success'); setDeleteId(null); load() }
    setDeleting(false)
  }

  async function toggle(post) {
    const next = post.status === 'published' ? 'draft' : 'published'
    const { error } = await supabase.from('posts').update({ status: next }).eq('id', post.id)
    if (error) toast(t.common.error, 'error')
    else { setPosts(prev => prev.map(pp => pp.id === post.id ? { ...pp, status: next } : pp)); toast(t.common.success, 'success') }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{p.title}</h1>
          <p className="text-slate-500 text-sm">{posts.length} {p.title.toLowerCase()}</p>
        </div>
        <Link to="/posts/new" className="btn btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {p.newPost}
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input type="search" placeholder={p.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} className="form-input max-w-xs" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="form-select w-44">
          <option value="">{p.allStatus}</option>
          <option value="published">{t.common.published}</option>
          <option value="draft">{t.common.draft}</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-sm">{p.noPost}</p>
            <Link to="/posts/new" className="btn btn-primary btn-sm mt-3">{p.addFirst}</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-600">{p.postTitle.replace(' *','')}</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">{p.publishDate}</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">{p.status}</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map(post => (
                  <tr key={post.id} className="table-row-hover">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        <p className="font-medium text-slate-800 truncate max-w-[220px]">{post.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{fmt(post.created_at, lang)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(post)} className={`badge cursor-pointer hover:opacity-80 transition-opacity ${STATUS_BADGE[post.status]}`}>
                        {STATUS_LABEL[post.status]}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link to={`/posts/${post.id}/edit`} className="btn btn-ghost btn-icon btn-sm text-slate-500 hover:text-navy-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Link>
                        <button onClick={() => setDeleteId(post.id)} className="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title={p.deleteTitle} message={p.deleteMsg} />
    </div>
  )
}
