import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { createCargo, deleteCargo, fetchCargos, updateCargo } from '../../services/cargosService'

function ModalGerenciarCargos({ onClose, onUpdated }) {
  const [cargos, setCargos] = useState([])
  const [novoNome, setNovoNome] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadCargos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchCargos()
      setCargos(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCargos()
  }, [loadCargos])

  const notifyUpdate = async () => {
    await loadCargos()
    onUpdated?.()
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    const nome = novoNome.trim()
    if (!nome) return

    setSaving(true)
    setError('')
    try {
      await createCargo({ nome, ativo: true })
      setNovoNome('')
      await notifyUpdate()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAtivo = async (cargo) => {
    setError('')
    try {
      await updateCargo(cargo.id, { nome: cargo.nome, ativo: !cargo.ativo })
      await notifyUpdate()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleDelete = async (cargo) => {
    const confirmed = window.confirm(`Excluir o cargo "${cargo.nome}"?`)
    if (!confirmed) return

    setError('')
    try {
      await deleteCargo(cargo.id)
      await notifyUpdate()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="modalOverlay modalOverlayStacked" onClick={onClose}>
      <div className="modalCard modalCardWide" onClick={(event) => event.stopPropagation()}>
        <div className="modalHeader">
          <h3>Cargos</h3>
          <button type="button" className="iconBtn" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <p className="modalHint">
          Cadastre os cargos disponíveis. Somente cargos <strong>ativos</strong> aparecem no
          dropdown ao criar ou editar usuários.
        </p>

        <form className="motivoInlineForm" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Nome do novo cargo"
            value={novoNome}
            onChange={(event) => setNovoNome(event.target.value)}
            maxLength={80}
          />
          <button type="submit" className="primaryBtn" disabled={saving || !novoNome.trim()}>
            <Plus size={18} />
            Adicionar
          </button>
        </form>

        {error && <p className="formError">{error}</p>}

        <div className="motivoListBox">
          {loading ? (
            <p className="tableMessage">Carregando cargos...</p>
          ) : cargos.length === 0 ? (
            <p className="tableMessage">Nenhum cargo cadastrado.</p>
          ) : (
            <ul className="motivoList">
              {cargos.map((cargo) => (
                <li key={cargo.id} className="motivoListItem">
                  <div className="motivoListInfo">
                    <span>{cargo.nome}</span>
                    <button
                      type="button"
                      className={cargo.ativo ? 'tag ok motivoTagBtn' : 'tag danger motivoTagBtn'}
                      onClick={() => handleToggleAtivo(cargo)}
                    >
                      {cargo.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="iconBtn dangerIcon"
                    onClick={() => handleDelete(cargo)}
                    aria-label={`Excluir ${cargo.nome}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modalActions">
          <button type="button" className="primaryBtn" onClick={onClose}>
            Concluir
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalGerenciarCargos
