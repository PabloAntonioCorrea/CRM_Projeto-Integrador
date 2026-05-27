import { BarChart3, BriefcaseBusiness, KanbanSquare, LayoutDashboard, LogOut, UserCog, Users } from 'lucide-react'

const navItems = [
  ['dashboard', LayoutDashboard, 'Dashboard'],
  ['leads', Users, 'Leads'],
  ['funil', KanbanSquare, 'Funil'],
  ['oportunidade', BriefcaseBusiness, 'Oportunidade'],
  ['relatorios', BarChart3, 'Relatórios'],
  ['usuarios', UserCog, 'Usuários'],
]

function Sidebar({ screen, setScreen }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandIcon">C</div>
        <div>
          <strong>CRM MEJ</strong>
          <span>Gestão Comercial</span>
        </div>
      </div>
      <nav>
        {navItems.map(([key, Icon, label]) => (
          <button key={key} onClick={() => setScreen(key)} className={screen === key ? 'navItem active' : 'navItem'}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
      <button className="logout">
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  )
}

export default Sidebar
