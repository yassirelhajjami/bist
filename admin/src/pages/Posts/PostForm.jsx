import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/client'
import RichTextEditor from '../../components/RichTextEditor'
import MediaUpload from '../../components/MediaUpload'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

const CATEGORIES = ['Actualité', 'Événement', 'Résultats', 'Annonce', 'Partenariat', 'Autre']

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast    = useToast()
  const { t }    = useLanguage()
  const p        = t.posts
  const isEdit   = Boolean(id)

  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', coverImage: '',
    category: 'Actualité', status: 'draft', publishDate: '',
  })
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    api.get(`/posts/${id}`).then(r => {
      const post = r.data.data
      setForm({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        coverImage: post.coverImage || '',
        category: post.category || 'Actualité',
        status: post.status || 'draft',
        publishDate: post.publishDate ? post.publishDate.slice(0, 10) : '',
      })
    }).finally(() => setFetching(false))
  }, [id, isEdit])

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target ? e.target.value : e })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return toast(t.common.required, 'error')
    if (!form.content.trim()) return toast(t.common.required, 'error')
    setLoading(true)
    try {
      const payload = { ...form, publishDate: form.status === 'published' && !form.publishDate ? new Date().toISOString() : form.publishDate || null }
      if (isEdit) await api.patch(`/posts/${id}`, payload)
      else await api.post('/posts', payload)
      toast(t.common.success, 'success')
      navigate('/posts')
    } catch (err) {
      toast(err.response?.data?.message || t.common.error, 'error')
    } finally { setLoading(false) }
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isEdit ? p.editPost : p.newPost}</h1>
        </div>
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
            <div>
              <label className="form-label">{p.publishDate}</label>
              <input type="date" value={form.publishDate} onChange={set('publishDate')} className="form-input" />
            </div>
            <div>
              <label className="form-label">{p.category}</label>
              <select value={form.category} onChange={set('category')} className="form-select">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="card card-body">
            <MediaUpload
              value={form.coverImage}
              onChange={url => setForm(f => ({ ...f, coverImage: url }))}
              subdir="images/posts"
              label={p.coverImage}
              helpText="JPG, PNG, WebP — max 10MB"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
