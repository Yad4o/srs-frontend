/**
 * App.tsx - Main application router and layout
 */

import { Suspense, useEffect } from 'react'
import { Route, Switch, useLocation } from 'wouter'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { useAuth } from '@/hooks/useAuth'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

// Pages
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import Dashboard from '@/pages/Dashboard'
import SubmitTicket from '@/pages/SubmitTicket'
import MyTickets from '@/pages/MyTickets'
import TicketView from '@/pages/TicketView'
import AgentQueue from '@/pages/AgentQueue'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminTickets from '@/pages/AdminTickets'
import NotFound from '@/pages/NotFound'

// Protected Route Component
function ProtectedRoute({ children, requiredRoles }: { children: React.ReactNode; requiredRoles?: string[] }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Login />
  }

  if (requiredRoles && !requiredRoles.includes(role || '')) {
    return <NotFound />
  }

  return <>{children}</>
}

function Router() {
  const [location] = useLocation()

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Protected Routes - All Users */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      {/* Protected Routes - Customers */}
      <Route path="/tickets/new">
        <ProtectedRoute requiredRoles={['user']}>
          <SubmitTicket />
        </ProtectedRoute>
      </Route>

      <Route path="/tickets">
        <ProtectedRoute requiredRoles={['user']}>
          <MyTickets />
        </ProtectedRoute>
      </Route>

      <Route path="/tickets/:id">
        <ProtectedRoute requiredRoles={['user', 'agent', 'admin']}>
          <TicketView />
        </ProtectedRoute>
      </Route>

      {/* Protected Routes - Agents & Admins */}
      <Route path="/queue">
        <ProtectedRoute requiredRoles={['agent', 'admin']}>
          <AgentQueue />
        </ProtectedRoute>
      </Route>

      {/* Protected Routes - Admins Only */}
      <Route path="/admin">
        <ProtectedRoute requiredRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/tickets">
        <ProtectedRoute requiredRoles={['admin']}>
          <AdminTickets />
        </ProtectedRoute>
      </Route>

      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Router />
        </Suspense>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
