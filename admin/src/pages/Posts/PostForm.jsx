import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import RichTextEditor from '../../components/RichTextEditor'
import MediaUpload from '../../components/MediaUpload'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now()
}

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast    = useToast()
  const { t }    = useLanguage()
  const p        = t.posts
  const isEdit   = Boolean(id)

  const [form, setForm] = useState({ title: '', content: '', excerpt: '', cover_image: '', status: 'draft' })
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    supabase.from('posts').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) setForm({ title: data.title || '', content: data.content || '', excerpt: data.excerpt || '', cover_image: data.cover_image || '', status: data.status || 'draft' })
      })
      .finally(() => setFetching(false))
  }, [id, isEdit])

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target ? e.target.value : e })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return toast(t.common.required, 'error')
    if (!form.content.trim()) return toast(t.common.required, 'error')
    setLoading(true)
    try {
      if (isEdit) {
        const { error } = await supabase.from('posts').update({ ...form, updated_at: new Date().toISOString() }).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('posts').insert({ ...form, slug: slugify(form.title) })
        if (error) throw error
      }
      toast(t.common.success, 'success')
      navigate('/posts')
    } catch (err) {
      toast(err.message || t.common.error, 'error')
    } finally { setLoading(false) }
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{isEdit ? p.editPost : p.newPost}</h1>
        <div className="flex gap-3 shrink-0">
          <button type="button" onClick={() => navigate('/posts')} className="btn btn-outline">{t.common.cancel}</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Spinner size="sm" color="white" /> : (isEdit ? t.common.update : p.addPost)}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card card-body space-y-4">
            <div>
              <label className="form-label">{p.postTitle}</label>
              <input value={form.title} onChange={set('title')} className="form-input text-lg font-medium" required />
            </div>
            <div>
              <label className="form-label">{p.content}</label>
              <RichTextEditor value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} />
            </div>
            <div>
              <label className="form-label">Résumé <span className="text-slate-400 font-normal">(optionnel — 280 caractères max)</span></label>
              <textarea value={form.excerpt} onChange={set('excerpt')} rows={3} maxLength={300} className="form-textarea" />
              <p className="text-xs text-slate-400 mt-1 text-right">{form.excerpt.length}/300</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card card-body space-y-4">
            <div>
              <label className="form-label">{p.status}</label>
              <select value={form.status} onChange={set('status')} className="form-select">
                <option value="draft">{t.common.draft}</option>
                <option value="published">{t.common.published}</option>
              </select>
            </div>
          </div>
          <div className="card card-body">
            <MediaUpload value={form.cover_image} onChange={url => setForm(f => ({ ...f, cover_image: url }))} subdir="images/posts" label={p.coverImage} helpText="JPG, PNG, WebP — max 10MB" />
          </div>
        </div>
      </div>
    </form>
  )
}
