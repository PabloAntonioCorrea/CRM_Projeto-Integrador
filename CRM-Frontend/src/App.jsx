import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './screens/Dashboard'
import Funil from './screens/Funil'
import LeadDetails from './screens/LeadDetails'
import LeadForm from './screens/LeadForm'
import Leads from './screens/Leads'
import Login from './screens/Login'
import OportunidadeDetails from './screens/OportunidadeDetails'
import OportunidadeForm from './screens/OportunidadeForm'
import Oportunidades from './screens/Oportunidades'
import Relatorios from './screens/Relatorios'
import UsuarioForm from './screens/UsuarioForm'
import Usuarios from './screens/Usuarios'
import './styles.css'

function AppShell({ currentUser, onLogout }) {
  const [screen, setScreen] = useState('dashboard')
  const [editingLeadId, setEditingLeadId] = useState(null)
  const [editingOportunidadeId, setEditingOportunidadeId] = useState(null)
  const [viewingOportunidadeId, setViewingOportunidadeId] = useState(null)
  const [editingUsuarioId, setEditingUsuarioId] = useState(null)
  const [viewingLeadId, setViewingLeadId] = useState(null)
  const openNewLead = () => {
    setEditingLeadId(null)
    setScreen('leadForm')
  }

  const openEditLead = (leadId) => {
    setEditingLeadId(leadId)
    setScreen('leadForm')
  }

  const openViewLead = (leadId) => {
    setViewingLeadId(leadId)
    setScreen('leadDetails')
  }

  const openNewOportunidade = () => {
    setEditingOportunidadeId(null)
    setScreen('oportunidadeForm')
  }

  const openEditOportunidade = (oportunidadeId) => {
    setEditingOportunidadeId(oportunidadeId)
    setScreen('oportunidadeForm')
  }

  const openViewOportunidade = (oportunidadeId) => {
    setViewingOportunidadeId(oportunidadeId)
    setScreen('oportunidadeDetails')
  }

  const openNewUsuario = () => {
    setEditingUsuarioId(null)
    setScreen('usuarioForm')
  }

  const openEditUsuario = (usuarioId) => {
    setEditingUsuarioId(usuarioId)
    setScreen('usuarioForm')
  }

  const screens = {
    dashboard: <Dashboard />,
    leads: (
      <Leads
        setScreen={setScreen}
        onNewLead={openNewLead}
        onEditLead={openEditLead}
        onViewLead={openViewLead}
      />
    ),
    leadForm: <LeadForm setScreen={setScreen} leadId={editingLeadId} />,
    leadDetails: (
      <LeadDetails
        setScreen={setScreen}
        leadId={viewingLeadId}
        onEditLead={openEditLead}
        onViewOportunidade={openViewOportunidade}
        currentUser={currentUser}
      />
    ),
    funil: (
      <Funil
        onNewOportunidade={openNewOportunidade}
        onViewOportunidade={openViewOportunidade}
        onEditOportunidade={openEditOportunidade}
        currentUser={currentUser}
      />
    ),
    oportunidade: (
      <Oportunidades
        setScreen={setScreen}
        onNewOportunidade={openNewOportunidade}
        onEditOportunidade={openEditOportunidade}
        onViewOportunidade={openViewOportunidade}
      />
    ),
    oportunidadeForm: (
      <OportunidadeForm setScreen={setScreen} oportunidadeId={editingOportunidadeId} />
    ),
    oportunidadeDetails: (
      <OportunidadeDetails
        setScreen={setScreen}
        oportunidadeId={viewingOportunidadeId}
        currentUser={currentUser}
      />
    ),
    relatorios: <Relatorios />,
    usuarios: (
      <Usuarios setScreen={setScreen} onNewUsuario={openNewUsuario} onEditUsuario={openEditUsuario} />
    ),
    usuarioForm: <UsuarioForm setScreen={setScreen} usuarioId={editingUsuarioId} />,
  }

  return (
    <div className="app">
      <Sidebar screen={screen} setScreen={setScreen} onLogout={onLogout} />
      <main className="content">{screens[screen] ?? <Dashboard />}</main>
    </div>
  )
}

function App() {
  const [sessionUser, setSessionUser] = useState(null)
  return sessionUser ? (
    <AppShell currentUser={sessionUser} onLogout={() => setSessionUser(null)} />
  ) : (
    <Login onLogin={(usuario) => setSessionUser(usuario)} />
  )
}

createRoot(document.getElementById('root')).render(<App />)
