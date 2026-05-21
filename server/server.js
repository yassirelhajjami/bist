require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const morgan     = require('morgan')
const path       = require('path')
const rateLimit  = require('express-rate-limit')

const authRoutes     = require('./src/routes/auth')
const postRoutes     = require('./src/routes/posts')
const galleryRoutes  = require('./src/routes/gallery')
const eventRoutes    = require('./src/routes/events')
const staffRoutes    = require('./src/routes/staff')
const contentRoutes  = require('./src/routes/content')
const settingsRoutes = require('./src/routes/settings')
const uploadRoutes   = require('./src/routes/upload')
const statsRoutes       = require('./src/routes/stats')
const submissionsRoutes = require('./src/routes/submissions')

const app = express()

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    process.env.ADMIN_URL  || 'http://localhost:5174',
  ],
  credentials: true,
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const limiter     = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false })
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  standardHeaders: true, legacyHeaders: false })
app.use('/api',            limiter)
app.use('/api/auth/login', authLimiter)

app.use('/api/auth',     authRoutes)
app.use('/api/posts',    postRoutes)
app.use('/api/gallery',  galleryRoutes)
app.use('/api/events',   eventRoutes)
app.use('/api/staff',    staffRoutes)
app.use('/api/content',  contentRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/upload',   uploadRoutes)
app.use('/api/stats',       statsRoutes)
app.use('/api/submissions', submissionsRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}] — Supabase`))
