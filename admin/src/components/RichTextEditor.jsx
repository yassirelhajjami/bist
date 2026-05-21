import { useRef, useEffect } from 'react'

const tools = [
  { cmd: 'bold',          icon: <strong>B</strong>,  title: 'Gras' },
  { cmd: 'italic',        icon: <em>I</em>,          title: 'Italique' },
  { cmd: 'underline',     icon: <u>U</u>,            title: 'Souligné' },
  { cmd: null },
  { cmd: 'formatBlock',   arg: 'h2',  icon: 'H2',   title: 'Titre 2' },
  { cmd: 'formatBlock',   arg: 'h3',  icon: 'H3',   title: 'Titre 3' },
  { cmd: 'formatBlock',   arg: 'p',   icon: '¶',    title: 'Paragraphe' },
  { cmd: null },
  { cmd: 'insertUnorderedList', icon: '≡', title: 'Liste à puces' },
  { cmd: 'insertOrderedList',   icon: '1.', title: 'Liste numérotée' },
  { cmd: null },
  { cmd: 'justifyLeft',   icon: '⬅', title: 'Gauche' },
  { cmd: 'justifyCenter', icon: '⬛', title: 'Centre' },
  { cmd: 'justifyRight',  icon: '➡', title: 'Droite' },
]

export default function RichTextEditor({ value, onChange, placeholder = 'Rédigez votre contenu ici...' }) {
  const editorRef = useRef(null)
  const lastValueRef = useRef(value)

  useEffect(() => {
    if (editorRef.current && value !== lastValueRef.current) {
      editorRef.current.innerHTML = value || ''
      lastValueRef.current = value
    }
  }, [value])

  function exec(cmd, arg) {
    editorRef.current.focus()
    document.execCommand(cmd, false, arg || null)
    lastValueRef.current = editorRef.current.innerHTML
    onChange(editorRef.current.innerHTML)
  }

  function onInput() {
    lastValueRef.current = editorRef.current.innerHTML
    onChange(editorRef.current.innerHTML)
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-navy-500 focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200">
        {tools.map((t, i) =>
          t.cmd === null ? (
            <div key={i} className="w-px h-5 bg-slate-300 mx-1" />
          ) : (
            <button
              key={i}
              type="button"
              title={t.title}
              onMouseDown={e => { e.preventDefault(); exec(t.cmd, t.arg) }}
              className="px-2 py-1 rounded text-sm text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors min-w-[28px] text-center"
            >
              {t.icon}
            </button>
          )
        )}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        className="min-h-48 p-4 text-sm text-slate-700 focus:outline-none prose prose-sm max-w-none"
        data-placeholder={placeholder}
        style={{ '--placeholder': `"${placeholder}"` }}
      />

      <style>{`
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        [contenteditable] h2 { font-size:1.25rem; font-weight:700; margin:0.75rem 0 0.5rem; }
        [contenteditable] h3 { font-size:1.1rem; font-weight:600; margin:0.6rem 0 0.4rem; }
        [contenteditable] p  { margin: 0.4rem 0; }
        [contenteditable] ul { list-style:disc; padding-left:1.5rem; margin:0.4rem 0; }
        [contenteditable] ol { list-style:decimal; padding-left:1.5rem; margin:0.4rem 0; }
      `}</style>
    </div>
  )
}
