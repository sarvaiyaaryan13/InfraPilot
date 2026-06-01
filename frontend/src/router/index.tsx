import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layout/AppLayout'
import { RequireAuth } from '@/components/RequireAuth'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { Deploy } from '@/pages/Deploy'
import { Deployments } from '@/pages/Deployments'
import { DeploymentDetails } from '@/pages/DeploymentDetails'
import { Monitoring } from '@/pages/Monitoring'
import { Logs } from '@/pages/Logs'
import { Settings } from '@/pages/Settings'
import { NotFound } from '@/pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'deploy', element: <Deploy /> },
      { path: 'deployments', element: <Deployments /> },
      { path: 'deployments/:id', element: <DeploymentDetails /> },
      { path: 'monitoring', element: <Monitoring /> },
      { path: 'logs', element: <Logs /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])