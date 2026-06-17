import { useSession } from '../../context/SessionContext'
import { getPerfilLabel, getUserInitials } from '../../utils/userDisplay'

function Header({ title, subtitle }) {
  const currentUser = useSession()

  return (
    <header className="pageHeader">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {currentUser && (
        <div className="profile">
          <div className="avatar">{getUserInitials(currentUser.nome)}</div>
          <div>
            <strong>{currentUser.nome}</strong>
            <span>{getPerfilLabel(currentUser.perfilAcesso)}</span>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
