import { useCallback, useEffect, useState } from 'react'
import { Edit, MessageSquarePlus, Trash2, X } from 'lucide-react'
import {
  createInteracaoForLead,
  createInteracaoForOportunidade,
  deleteInteracao,
  fetchInteracoesByLead,
  fetchInteracoesByOportunidade,
  updateInteracao,
} from '../../services/interacoesService'
import { fetchUsuariosOpcoes } from '../../services/usuariosService'

const InteracaoTipos = [
  { value: 'Ligacao', label: 'Ligação' },
  { value: 'Email', label: 'E-mail' },
  { value: 'Reuniao', label: 'Reunião' },
  { value: 'Nota', label: 'Nota' },
  { value: 'Registro', label: 'Registro' },
]

const toDateTimeLocalValue = (date = new Date()) => {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

const brDateTimeToInput = (brDateTime) => {
  if (!brDateTime) return toDateTimeLocalValue()
  const [datePart, timePart] = brDateTime.split(' ')
  const [day, month, year] = datePart.split('/')
  if (!day || !month || !year) return toDateTimeLocalValue()
  const time = timePart ?? '00:00'
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`
}

const buildEmptyForm = (currentUser, oportunidadeId) => ({
  tipo: 'Ligacao',
  descricao: '',
  dataInteracao: toDateTimeLocalValue(),
  usuarioId: currentUser?.id ? String(currentUser.id) : '',
  oportunidadeId: oportunidadeId ? String(oportunidadeId) : '',
})

const buildFormFromInteracao = (interacao, currentUser, oportunidadeId) => ({
  tipo: interacao.tipoDb ?? 'Ligacao',
  descricao: interacao.descricao ?? '',
  dataInteracao: brDateTimeToInput(interacao.dataInteracao),
  usuarioId: String(interacao.usuarioId ?? currentUser?.id ?? ''),
  oportunidadeId: String(interacao.oportunidadeId ?? oportunidadeId ?? ''),
})

function PainelInteracoes({ leadId, oportunidadeId, oportunidades = [], currentUser }) {
  const [interacoes, setInteracoes] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(buildEmptyForm(currentUser, oportunidadeId))
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadInteracoes = useCallback(async () => {
    if (!leadId && !oportunidadeId) return
    setLoading(true)
    setError('')
    try {
      const data = oportunidadeId
        ? await fetchInteracoesByOportunidade(oportunidadeId)
        : await fetchInteracoesByLead(leadId)
      setInteracoes(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [leadId, oportunidadeId])

  useEffect(() => {
    loadInteracoes()
  }, [loadInteracoes])

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const data = await fetchUsuariosOpcoes()
        setUsuarios(data)
      } catch {
        setUsuarios([])
      }
    }
    loadUsuarios()
  }, [])

  useEffect(() => {
    if (!editingId) {
      setForm(buildEmptyForm(currentUser, oportunidadeId))
    }
  }, [currentUser, oportunidadeId, editingId])

  const resetForm = () => {
    setForm(buildEmptyForm(currentUser, oportunidadeId))
    setEditingId(null)
    setShowForm(false)
  }

  const openNewForm = () => {
    if (showForm && !editingId) {
      resetForm()
      return
    }
    setEditingId(null)
    setForm(buildEmptyForm(currentUser, oportunidadeId))
    setShowForm(true)
  }

  const openEditForm = (interacao) => {
    setEditingId(interacao.id)
    setForm(buildFormFromInteracao(interacao, currentUser, oportunidadeId))
    setShowForm(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        tipo: form.tipo,
        descricao: form.descricao,
        dataInteracao: form.dataInteracao,
        usuarioId: Number(form.usuarioId),
      }
      if (!oportunidadeId && form.oportunidadeId) {
        payload.oportunidadeId = Number(form.oportunidadeId)
      }
      if (editingId) {
        await updateInteracao(editingId, payload)
      } else if (oportunidadeId) {
        await createInteracaoForOportunidade(oportunidadeId, payload)
      } else {
        await createInteracaoForLead(leadId, payload)
      }
      resetForm()
      await loadInteracoes()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (interacao) => {
    const confirmed = window.confirm('Excluir esta interação?')
    if (!confirmed) return
    setError('')
    try {
      await deleteInteracao(interacao.id)
      if (editingId === interacao.id) {
        resetForm()
      }
      await loadInteracoes()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="leadTabContent">
      <div className="leadActionBar">
        <button type="button" className="secondaryBtn" onClick={openNewForm}>
          <MessageSquarePlus size={18} />
          {showForm && !editingId ? 'Fechar formulário' : 'Registrar interação'}
        </button>
      </div>

      {showForm && (
        <form className="interacaoForm formGrid" onSubmit={handleSubmit}>
          <label className="inputGroup">
            <span>Tipo</span>
            <select name="tipo" value={form.tipo} onChange={handleChange} required>
              {InteracaoTipos.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </label>
          <label className="inputGroup">
            <span>Data e hora</span>
            <input
              type="datetime-local"
              name="dataInteracao"
              value={form.dataInteracao}
              onChange={handleChange}
              required
            />
          </label>
          <label className="inputGroup">
            <span>Responsável</span>
            <select name="usuarioId" value={form.usuarioId} onChange={handleChange} required>
              <option value="">Selecione</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
          </label>
          {!oportunidadeId && oportunidades.length > 0 && (
            <label className="inputGroup">
              <span>Oportunidade (opcional)</span>
              <select name="oportunidadeId" value={form.oportunidadeId} onChange={handleChange}>
                <option value="">Nenhuma</option>
                {oportunidades.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.titulo}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="inputGroup fullLine">
            <span>Descrição</span>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={4}
              required
            />
          </label>
          <div className="entityFormActions fullLine">
            {editingId && (
              <button type="button" className="secondaryBtn" onClick={resetForm}>
                <X size={18} />
                Cancelar edição
              </button>
            )}
            <button type="submit" className="primaryBtn" disabled={saving}>
              {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Salvar interação'}
            </button>
          </div>
        </form>
      )}

      {error && <p className="formError">{error}</p>}

      {loading ? (
        <p className="tableMessage">Carregando interações...</p>
      ) : interacoes.length === 0 ? (
        <p className="tableMessage">Nenhuma interação registrada.</p>
      ) : (
        <div className="timelineList">
          {interacoes.map((item) => (
            <article className="timelineCard" key={item.id}>
              <div className="timelineMeta">
                <strong>{item.tipo}</strong>
                <span>{item.dataInteracao}</span>
              </div>
              <p>{item.descricao}</p>
              <div className="timelineMeta timelineCardFooter">
                <span>
                  {item.responsavel}
                  {item.oportunidadeTitulo && ` · ${item.oportunidadeTitulo}`}
                </span>
                <div className="timelineCardActions">
                  <button
                    type="button"
                    className="iconBtn"
                    onClick={() => openEditForm(item)}
                    aria-label="Editar interação"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    className="iconBtn dangerIcon"
                    onClick={() => handleDelete(item)}
                    aria-label="Excluir interação"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default PainelInteracoes
