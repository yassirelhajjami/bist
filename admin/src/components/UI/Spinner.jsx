export default function Spinner({ size = 'md', color = 'navy' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-3' }
  const colors = { navy: 'border-navy-900 border-t-transparent', crimson: 'border-crimson-600 border-t-transparent', white: 'border-white border-t-transparent' }
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} role="status">
      <span className="sr-only">Chargement...</span>
    </div>
  )
}
