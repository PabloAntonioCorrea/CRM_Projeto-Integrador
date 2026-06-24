const DefaultNavigation = {
  screen: 'dashboard',
  editingLeadId: null,
  viewingLeadId: null,
  editingOportunidadeId: null,
  viewingOportunidadeId: null,
  editingUsuarioId: null,
  activeTab: null,
}

const parseId = (value) => {
  if (!value) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export const buildNavigationPath = (state) => {
  const screen = state.screen ?? 'dashboard'

  if (screen === 'leadForm') {
    return state.editingLeadId ? `#/leads/editar/${state.editingLeadId}` : '#/leads/novo'
  }
  if (screen === 'leadDetails' && state.viewingLeadId) {
    const tabSuffix = state.activeTab && state.activeTab !== 'oportunidades' ? `/${state.activeTab}` : ''
    return `#/leads/${state.viewingLeadId}${tabSuffix}`
  }
  if (screen === 'oportunidadeForm') {
    return state.editingOportunidadeId
      ? `#/oportunidades/editar/${state.editingOportunidadeId}`
      : '#/oportunidades/nova'
  }
  if (screen === 'oportunidadeDetails' && state.viewingOportunidadeId) {
    const tabSuffix = state.activeTab && state.activeTab !== 'timeline' ? `/${state.activeTab}` : ''
    return `#/oportunidades/${state.viewingOportunidadeId}${tabSuffix}`
  }
  if (screen === 'usuarioForm') {
    return state.editingUsuarioId
      ? `#/usuarios/editar/${state.editingUsuarioId}`
      : '#/usuarios/novo'
  }

  const paths = {
    dashboard: '#/dashboard',
    leads: '#/leads',
    funil: '#/funil',
    oportunidade: '#/oportunidades',
    relatorios: '#/relatorios',
    usuarios: '#/usuarios',
  }

  return paths[screen] ?? '#/dashboard'
}

export const parseNavigationPath = (hash = '') => {
  const path = hash.replace(/^#/, '').replace(/^\//, '')
  const segments = path.split('/').filter(Boolean)

  if (segments.length === 0) return { ...DefaultNavigation }

  if (segments[0] === 'leads') {
    if (segments[1] === 'novo') {
      return { ...DefaultNavigation, screen: 'leadForm' }
    }
    if (segments[1] === 'editar' && segments[2]) {
      return { ...DefaultNavigation, screen: 'leadForm', editingLeadId: parseId(segments[2]) }
    }
    if (segments[1]) {
      const viewingLeadId = parseId(segments[1])
      const activeTab = segments[2] ?? 'oportunidades'
      return { ...DefaultNavigation, screen: 'leadDetails', viewingLeadId, activeTab }
    }
    return { ...DefaultNavigation, screen: 'leads' }
  }

  if (segments[0] === 'oportunidades') {
    if (segments[1] === 'nova') {
      return { ...DefaultNavigation, screen: 'oportunidadeForm' }
    }
    if (segments[1] === 'editar' && segments[2]) {
      return {
        ...DefaultNavigation,
        screen: 'oportunidadeForm',
        editingOportunidadeId: parseId(segments[2]),
      }
    }
    if (segments[1]) {
      const viewingOportunidadeId = parseId(segments[1])
      const activeTab = segments[2] ?? 'timeline'
      return {
        ...DefaultNavigation,
        screen: 'oportunidadeDetails',
        viewingOportunidadeId,
        activeTab,
      }
    }
    return { ...DefaultNavigation, screen: 'oportunidade' }
  }

  if (segments[0] === 'usuarios') {
    if (segments[1] === 'novo') {
      return { ...DefaultNavigation, screen: 'usuarioForm' }
    }
    if (segments[1] === 'editar' && segments[2]) {
      return { ...DefaultNavigation, screen: 'usuarioForm', editingUsuarioId: parseId(segments[2]) }
    }
    return { ...DefaultNavigation, screen: 'usuarios' }
  }

  const screenMap = {
    dashboard: 'dashboard',
    funil: 'funil',
    relatorios: 'relatorios',
  }

  return { ...DefaultNavigation, screen: screenMap[segments[0]] ?? 'dashboard' }
}

export const getInitialNavigation = () => {
  if (window.history.state?.screen) {
    return { ...DefaultNavigation, ...window.history.state }
  }
  return parseNavigationPath(window.location.hash)
}

export const createScreenNavigation = (screen) => ({
  ...DefaultNavigation,
  screen,
})
