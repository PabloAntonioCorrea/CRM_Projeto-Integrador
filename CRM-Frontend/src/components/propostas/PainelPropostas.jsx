import { useCallback, useEffect, useState } from 'react'
import { PenLine, Plus, Trash2 } from 'lucide-react'
import {
  createProposta,
  deleteProposta,
  fetchPropostasByOportunidade,
} from '../../services/propostasService'
import { maskValorInput, parseValorInputToAmount } from '../../utils/currencyInput'

const PropostaStatusOptions = [
  { value: 'Rascunho', label: 'Rascunho' },
  { value: 'Enviada', label: 'Enviada' },
  { value: 'EmNegociacao', label: 'Em negociação' },
  { value: 'Aceita', label: 'Aceita' },
  { value: 'Recusada', label: 'Recusada' },
]

const buildEmptyForm = (currentUser) => ({
  titulo: '',
  valor: '',
  status: 'Rascunho',
  dataProposta: new Date().toISOString().slice(0, 10),
  usuarioId: currentUser?.id ? String(currentUser.id) : '',
})

const getStatusTagClass = (statusDb) => {
  if (statusDb === 'Aceita') return 'tag ok'
  if (statusDb === 'Recusada') return 'tag danger'
  if (statusDb === 'Enviada' || statusDb === 'EmNegociacao') return 'tag'
  return 'tag'
}

function PainelPropostas({ oportunidadeId, currentUser, onPropostasChange }) {
  const [propostas, setPropostas] = useState([])
  const [form, setForm] = useState(buildEmptyForm(currentUser))
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadPropostas = useCallback(async () => {
    if (!oportunidadeId) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchPropostasByOportunidade(oportunidadeId)
      setPropostas(data)
      onPropostasChange?.(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [oportunidadeId])

  useEffect(() => {
    loadPropostas()
  }, [loadPropostas])

  useEffect(() => {
    setForm(buildEmptyForm(currentUser))
  }, [currentUser])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleValorChange = (event) => {
    setForm((previous) => ({ ...previous, valor: maskValorInput(event.target.value) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createProposta(oportunidadeId, {
        titulo: form.titulo,
        valor: parseValorInputToAmount(form.valor),
        status: form.status,
        dataProposta: form.dataProposta,
        usuarioId: Number(form.usuarioId),
      })
      setForm(buildEmptyForm(currentUser))
      setShowForm(false)
      await loadPropostas()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (proposta) => {
    const confirmed = window.confirm(`Excluir a proposta "${proposta.titulo}"?`)
    if (!confirmed) return
    setError('')
    try {
      await deleteProposta(proposta.id)
      await loadPropostas()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="leadTabContent">
      <div className="leadActionBar">
        <button type="button" className="primaryBtn" onClick={() => setShowForm((value) => !value)}>
          <Plus size={18} />
          {showForm ? 'Fechar formulário' : 'Nova proposta'}
        </button>
      </div>

      {showForm && (
        <form className="interacaoForm formGrid" onSubmit={handleSubmit}>
          <label className="inputGroup">
            <span>Título</span>
            <input name="titulo" value={form.titulo} onChange={handleChange} required />
          </label>
          <label className="inputGroup">
            <span>Valor</span>
            <input
              name="valor"
              value={form.valor}
              onChange={handleValorChange}
              placeholder="R$ 0,00"
              required
            />
          </label>
          <label className="inputGroup">
            <span>Data</span>
            <input
              type="date"
              name="dataProposta"
              value={form.dataProposta}
              onChange={handleChange}
              required
            />
          </label>
          <label className="inputGroup">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange} required>
              {PropostaStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="entityFormActions fullLine">
            <button type="submit" className="primaryBtn" disabled={saving}>
              <PenLine size={18} />
              {saving ? 'Salvando...' : 'Salvar proposta'}
            </button>
          </div>
        </form>
      )}

      {error && <p className="formError">{error}</p>}

      {loading ? (
        <p className="tableMessage">Carregando propostas...</p>
      ) : propostas.length === 0 ? (
        <p className="tableMessage">Nenhuma proposta cadastrada.</p>
      ) : (
        <div className="tableCard">
          <table>
            <thead>
              <tr>
                <th>Proposta</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {propostas.map((proposta) => (
                <tr key={proposta.id}>
                  <td>{proposta.titulo}</td>
                  <td>{proposta.dataProposta}</td>
                  <td>{proposta.valor}</td>
                  <td>
                    <span className={getStatusTagClass(proposta.statusDb)}>{proposta.status}</span>
                  </td>
                  <td className="actions">
                    <Trash2 size={16} onClick={() => handleDelete(proposta)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PainelPropostas
