import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import { useAuth } from './hooks/useAuth'
import AdminPage from './pages/AdminPage'
import EventDetailPage from './pages/EventDetailPage'
import EventsPage from './pages/EventsPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import OrganizerPage from './pages/OrganizerPage'
import SubmitEventPage from './pages/SubmitEventPage'

function AdminRoute() {
  const { isChecking } = useAuth()

  if (isChecking) {
    return <p className="rounded-xl bg-slate-900/60 p-4 text-slate-300">Validando acceso...</p>
  }

  return <AdminPage />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'event/:id', element: <EventDetailPage /> },
      { path: 'submit', element: <SubmitEventPage /> },
      { path: 'organizer', element: <OrganizerPage /> },
      { path: 'admin', element: <AdminRoute /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
