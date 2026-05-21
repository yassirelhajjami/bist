import { useState, useRef } from 'react'
import api from '../api/client'
import Spinner from './UI/Spinner'

export default function MediaUpload({ value, onChange, subdir = 'images/general', accept = 'image/*', label = 'Image', helpText }) {
  const [loading, setLoading]   = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  async function upload(file) {
    if (!file) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await api.post(`/upload/image?subdir=${subdir}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(data.url)
    } catch (e) {
      alert('Erreur lors du téléchargement : ' + (e.response?.data?.message || e.message))
    } finally {
      setLoading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  return (
    <div>
      <label className="form-label">{label}</label>

      {value ? (
        <div className="relative group w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt="Preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current.click()} className="btn btn-outline btn-sm bg-white">
              Changer
            </button>
            <button type="button" onClick={() => onChange('')} className="btn btn-danger btn-sm">
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !loading && inputRef.current.click()}
          className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
            ${dragging ? 'border-navy-500 bg-navy-50' : 'border-slate-300 hover:border-navy-400 hover:bg-slate-50'}
          `}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-slate-500">Glissez-déposez ou <span className="text-navy-600 font-medium">parcourir</span></p>
              {helpText && <p className="text-xs text-slate-400">{helpText}</p>}
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => upload(e.target.files[0])}
      />
    </div>
  )
}
