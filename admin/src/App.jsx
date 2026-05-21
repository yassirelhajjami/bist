import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './components/UI/Toast'
import DashboardLayout from './components/Layout/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PostsList from './pages/Posts/PostsList'
import PostForm from './pages/Posts/PostForm'
import GalleryManager from './pages/Gallery/GalleryManager'
import EventsList from './pages/Events/EventsList'
import EventForm from './pages/Events/EventForm'
import HomepageEditor from './pages/Homepage/HomepageEditor'
import AdmissionsEditor from './pages/Admissions/AdmissionsEditor'
import StaffList from './pages/Staff/StaffList'
import StaffForm from './pages/Staff/StaffForm'
import SettingsPage from './pages/Settings/SettingsPage'
import SubmissionsList from './pages/Submissions/SubmissionsList'
import Spinner from './components/UI/Spinner'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  return user ? <Navigate to="/" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="posts" element={<PostsList />} />
        <Route path="posts/new" element={<PostForm />} />
        <Route path="posts/:id/edit" element={<PostForm />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="events" element={<EventsList />} />
        <Route path="events/new" element={<EventForm />} />
        <Route path="events/:id/edit" element={<EventForm />} />
        <Route path="homepage" element={<HomepageEditor />} />
        <Route path="admissions" element={<AdmissionsEditor />} />
        <Route path="staff" element={<StaffList />} />
        <Route path="staff/new" element={<StaffForm />} />
        <Route path="staff/:id/edit" element={<StaffForm />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="submissions" element={<SubmissionsList />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/admin-panel">
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
