import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { AdvisorSidebar, ClientSidebar } from './components/shared/Sidebar'
import { clients } from './data/demoData'

// Pages
import RoleSelector from './pages/RoleSelector'
import AdvisorDashboard from './pages/advisor/AdvisorDashboard'
import ClientList from './pages/advisor/ClientList'
import ClientDetail from './pages/advisor/ClientDetail'
import BroadcastMessages from './pages/advisor/BroadcastMessages'
import AdvisorDocuments from './pages/advisor/AdvisorDocuments'
import ClientDashboard from './pages/client/ClientDashboard'
import ClientPortfolio from './pages/client/ClientPortfolio'
import LifeEvents from './pages/client/LifeEvents'
import Goals from './pages/client/Goals'
import ClientMessages from './pages/client/ClientMessages'
import ClientDocuments from './pages/client/ClientDocuments'
import MeetingAgenda from './pages/client/MeetingAgenda'

function AdvisorLayout() {
  const { role, totalUnread } = useApp()
  if (role !== 'advisor') return <Navigate to="/nexus" replace />
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AdvisorSidebar unreadTotal={totalUnread()} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  )
}

function ClientLayout() {
  const { role, selectedClientId, unreadCount } = useApp()
  if (role !== 'client') return <Navigate to="/nexus" replace />
  const client = clients.find(c => c.id === selectedClientId)
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <ClientSidebar client={client} unreadCount={unreadCount(selectedClientId)} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/nexus" element={<RoleSelector />} />
      <Route path="/nexus/advisor" element={<AdvisorLayout />}>
        <Route index element={<AdvisorDashboard />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="messages" element={<BroadcastMessages />} />
        <Route path="documents" element={<AdvisorDocuments />} />
      </Route>
      <Route path="/nexus/client" element={<ClientLayout />}>
        <Route index element={<ClientDashboard />} />
        <Route path="portfolio" element={<ClientPortfolio />} />
        <Route path="goals" element={<Goals />} />
        <Route path="life-events" element={<LifeEvents />} />
        <Route path="agenda" element={<MeetingAgenda />} />
        <Route path="messages" element={<ClientMessages />} />
        <Route path="documents" element={<ClientDocuments />} />
      </Route>
      <Route path="*" element={<Navigate to="/nexus" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
