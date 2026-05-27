import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'
import Field from '../components/common/Field'
import Header from '../components/layout/Header'
import { fetchEtapasFunil } from '../services/etapasService'
import { fetchLeads } from '../services/leadsService'
import {
  createOportunidade,
  fetchOportunidadeById,
  updateOportunidade,
} from '../services/oportunidadesService'
import { fetchUsuarios } from '../services/usuariosService'
import { formatValorFromAmount, maskValorInput, parseValorInputToAmount } from '../utils/currencyInput'

const EmptyForm = {
  leadId: '',
  titulo: '',
  usuarioId: '',
  valorEstimado: '',
  prioridade: 'Média',
  etapaFunilId: '',
}

function OportunidadeForm({ setScreen, oportunidadeId }) {
  const [form, setForm] = useState(EmptyForm)
  const [leads, setLeads] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [etapas, setEtapas] = useState([])
  const [loading, setLoading] = useState(Boolean(oportunidadeId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEditing = Boolean(oportunidadeId)

  useEffect(() => {
    const loadFormData = async () => {
      setError('')
      try {
        const [leadsData, usuariosData, etapasData] = await Promise.all([
          fetchLeads(),
          fetchUsuarios(),
          fetchEtapasFunil(),
        ])
        setLeads(leadsData)
        setUsuarios(usuariosData)
        setEtapas(etapasData)

        if (!oportunidadeId) {
          setForm({ ...EmptyForm })
          setLoading(false)
          return
        }

        const oportunidade = await fetchOportunidadeById(oportunidadeId)
        setForm({
          leadId: String(oportunidade.leadId ?? ''),
          titulo: oportunidade.titulo ?? '',
          usuarioId: String(oportunidade.usuarioId ?? ''),
          valorEstimado: formatValorFromAmount(oportunidade.valorEstimado),
          prioridade: oportunidade.prioridade ?? 'Média',
          etapaFunilId: String(oportunidade.etapaFunilId ?? ''),
        })
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setLoading(false)
      }
    }
    loadFormData()
  }, [oportunidadeId])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleValorChange = (event) => {
    const masked = maskValorInput(event.target.value)
    setForm((current) => ({ ...current, valorEstimado: masked }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        leadId: Number(form.leadId),
        titulo: form.titulo,
        usuarioId: Number(form.usuarioId),
        etapaFunilId: Number(form.etapaFunilId),
        prioridade: form.prioridade,
        valorEstimado: parseValorInputToAmount(form.valorEstimado),
      }
      if (isEditing) {
        await updateOportunidade(oportunidadeId, payload)
      } else {
        await createOportunidade(payload)
      }
      setScreen('oportunidade')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header
          title={isEditing ? 'Editar Oportunidade' : 'Cadastro de Oportunidade'}
          subtitle="Carregando dados do formulário"
        />
        <p className="tableMessage">Carregando...</p>
      </>
    )
  }

  return (
    <>
      <Header
        title={isEditing ? 'Editar Oportunidade' : 'Cadastro de Oportunidade'}
        subtitle="Crie ou edite uma oportunidade de venda"
      />
      <section className="formPanel">
        <form onSubmit={handleSubmit}>
          <div className="formGrid">
            <label className="inputGroup">
              <span>Lead</span>
              <select name="leadId" value={form.leadId} onChange={handleChange} required>
                <option value="">Selecione</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.empresa || lead.nome}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Título da oportunidade"
              name="titulo"
              placeholder="Ex: Projeto CRM Simplificado"
              value={form.titulo}
              onChange={handleChange}
              required
            />
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
            <label className="inputGroup">
              <span>Valor estimado</span>
              <input
                type="text"
                inputMode="numeric"
                name="valorEstimado"
                placeholder="R$ 0,00"
                value={form.valorEstimado}
                onChange={handleValorChange}
                required
              />
            </label>
            <label className="inputGroup">
              <span>Prioridade</span>
              <select name="prioridade" value={form.prioridade} onChange={handleChange}>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </label>
            <label className="inputGroup">
              <span>Etapa do funil</span>
              <select name="etapaFunilId" value={form.etapaFunilId} onChange={handleChange} required>
                <option value="">Selecione</option>
                {etapas.map((etapa) => (
                  <option key={etapa.id} value={etapa.id}>
                    {etapa.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {error && <p className="formError">{error}</p>}
          <div className="formActions">
            <button type="button" className="secondaryBtn" onClick={() => setScreen('oportunidade')}>
              <X size={18} />
              Cancelar
            </button>
            <button type="submit" className="primaryBtn" disabled={saving}>
              <Save size={18} />
              {saving ? 'Salvando...' : 'Salvar Oportunidade'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default OportunidadeForm
