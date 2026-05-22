import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import ConfirmDialog from '../../components/UI/ConfirmDialog'
import Modal from '../../components/UI/Modal'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

const BUCKET = 'media'
const CATEGORIES = ['Vie scolaire', 'Activités', 'Infrastructure', 'Événements', 'Autre']

export default function GalleryManager() {
  const toast = useToast()
  const { t } = useLanguage()
  const gl = t.gallery
  const inputRef = useRef(null)
  const [images, setImages]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filterCat, setFilterCat] = useState('')
  const [dragging, setDragging]   = useState(false)
  const [selected, setSelected]   = useState([])
  const [deleteId, setDeleteId]   = useState(null)
  const [bulkConfirm, setBulkConfirm] = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [editImage, setEditImage] = useState(null)
  const [uploadCat, setUploadCat] = useState('Vie scolaire')
  const [preview, setPreview]     = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (filterCat) q = q.eq('category', filterCat)
    const { data } = await q
    setImages(data || [])
    setLoading(false)
  }, [filterCat])

  useEffect(() => { load() }, [load])

  async function uploadFiles(files) {
    if (!files?.length) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const path = `images/gallery/${Date.now()}-${file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '')}`
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
        if (upErr) { toast(upErr.message, 'error'); continue }
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
        await supabase.from('gallery').insert({ url: publicUrl, thumbnail_url: publicUrl, category: uploadCat, caption: '' })
      }
      toast(`${files.length} ${gl.selected}`, 'success')
      load()
    } catch (err) {
      toast(err.message || t.common.error, 'error')
    } finally { setUploading(false) }
  }

  async function handleDelete() {
    setDeleting(true)
    await supabase.from('gallery').delete().eq('id', deleteId)
    toast(t.common.success, 'success')
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  async function handleBulkDelete() {
    setDeleting(true)
    await supabase.from('gallery').delete().in('id', selected)
    toast(`${selected.length} ${gl.selected}`, 'success')
    setSelected([])
    setBulkConfirm(false)
    setDeleting(false)
    load()
  }

  async function updateCaption() {
    if (!editImage) return
    await supabase.from('gallery').update({ caption: editImage.caption, category: editImage.category }).eq('id', editImage.id)
    toast(t.common.success, 'success')
    setEditImage(null)
    load()
  }

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{gl.title}</h1>
          <p className="text-slate-500 text-sm">{images.length} image{images.length !== 1 ? 's' : ''} — <span className="text-emerald-600 font-medium">{gl.publishedOnSite}</span></p>
        </div>
        <div className="flex gap-3">
          {selected.length > 0 && (
            <button onClick={() => setBulkConfirm(true)} className="btn btn-danger btn-sm">{gl.deleteSelected} ({selected.length})</button>
          )}
          <button onClick={() => inputRef.current.click()} className="btn btn-primary" disabled={uploading}>
            {uploading ? <Spinner size="sm" color="white" /> : (<><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> {gl.upload}</>)}
          </button>
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="form-label mb-0 shrink-0">{gl.category} :</label>
          <select value={uploadCat} onChange={e => setUploadCat(e.target.value)} className="form-select w-44">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); uploadFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current.click()}
          className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${dragging ? 'border-navy-500 bg-navy-50' : 'border-slate-200 hover:border-navy-400 hover:bg-slate-50'}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2"><Spinner /><p className="text-sm text-slate-500">{t.common.loading}</p></div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <p className="text-sm font-medium text-slate-600">{gl.dropzone}</p>
              <p className="text-xs">{gl.dropzoneHint}</p>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => uploadFiles(e.target.files)} />
      </div>

      <div className="flex flex-wrap gap-2">
        {['', ...CATEGORIES].map(c => (
          <button key={c || 'all'} onClick={() => setFilterCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterCat === c ? 'bg-navy-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {c || gl.allCategories}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
      ) : images.length === 0 ? (
        <div className="card flex flex-col items-center justify-center h-48 text-slate-400">
          <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="text-sm">{gl.noImages} — {gl.uploadFirst}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map(img => (
            <div key={img.id} className={`relative group rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selected.includes(img.id) ? 'border-navy-500 ring-2 ring-navy-300' : 'border-transparent'}`}>
              <img src={img.thumbnail_url || img.url} alt={img.caption || ''} className="w-full h-36 object-cover" onClick={() => setPreview(img)} />
              <div className="absolute top-2 left-2 w-5 h-5 rounded border-2 border-white bg-white/80 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={e => { e.stopPropagation(); toggleSelect(img.id) }}>
                {selected.includes(img.id) && <svg className="w-3 h-3 text-navy-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                <button onClick={e => { e.stopPropagation(); setEditImage({ ...img }) }} className="btn btn-outline btn-sm bg-white py-1 px-2 text-xs">{t.common.edit}</button>
                <button onClick={e => { e.stopPropagation(); setDeleteId(img.id) }} className="btn btn-danger btn-sm py-1 px-2 text-xs">×</button>
              </div>
              {img.caption && <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"><p className="text-white text-xs truncate">{img.caption}</p></div>}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!preview} onClose={() => setPreview(null)} title={preview?.caption || t.common.preview} size="lg">
        {preview && (<div className="p-4"><img src={preview.url} alt={preview.caption} className="w-full max-h-[60vh] object-contain rounded-xl" /></div>)}
      </Modal>

      <Modal isOpen={!!editImage} onClose={() => setEditImage(null)} title={gl.editImage} size="sm">
        {editImage && (
          <div className="p-6 space-y-4">
            <img src={editImage.thumbnail_url || editImage.url} alt="" className="w-full h-32 object-cover rounded-xl" />
            <div>
              <label className="form-label">{gl.caption}</label>
              <input value={editImage.caption || ''} onChange={e => setEditImage(i => ({ ...i, caption: e.target.value }))} className="form-input" placeholder={gl.captionPlaceholder} />
            </div>
            <div>
              <label className="form-label">{gl.category}</label>
              <select value={editImage.category} onChange={e => setEditImage(i => ({ ...i, category: e.target.value }))} className="form-select">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditImage(null)} className="btn btn-outline">{t.common.cancel}</button>
              <button onClick={updateCaption} className="btn btn-primary">{t.common.save}</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title={gl.deleteTitle} message={gl.deleteMsg} />
      <ConfirmDialog isOpen={bulkConfirm} onClose={() => setBulkConfirm(false)} onConfirm={handleBulkDelete} loading={deleting} title={gl.bulkDeleteTitle} message={`${selected.length} ${gl.bulkDeleteMsg}`} />
    </div>
  )
}
