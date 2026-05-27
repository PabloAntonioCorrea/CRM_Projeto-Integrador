function Header({ title, subtitle }) {
  return (
    <header className="pageHeader">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="profile">
        <div className="avatar">PC</div>
        <div>
          <strong>Pablo Corrêa</strong>
          <span>Administrador</span>
        </div>
      </div>
    </header>
  )
}

export default Header
