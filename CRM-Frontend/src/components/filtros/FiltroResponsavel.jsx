import { useEffect, useState } from 'react'
import { fetchUsuariosOpcoes } from '../../services/usuariosService'

const FilterLabels = {
  all: 'Todos os responsáveis',
}

function FiltroResponsavel({ value, onChange }) {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    let active = true
    fetchUsuariosOpcoes()
      .then((data) => {
        if (active) setUsuarios(data)
      })
      .catch(() => {
        if (active) setUsuarios([])
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{FilterLabels.all}</option>
      {usuarios.map((usuario) => (
        <option key={usuario.id} value={usuario.id}>
          {usuario.nome}
        </option>
      ))}
    </select>
  )
}

export default FiltroResponsavel
