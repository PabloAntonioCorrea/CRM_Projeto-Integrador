import { useCallback, useEffect, useMemo, useState } from 'react'
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react'
import Header from '../components/layout/Header'
import FiltroResponsavel from '../components/filtros/FiltroResponsavel'
import TarefaPendenteTag from '../components/tarefas/TarefaPendenteTag'
import { deleteOportunidade, fetchOportunidades } from '../services/oportunidadesService'
import { getPriorityClass } from '../utils/priorityClass'

function Oportunidades({ setScreen, onNewOportunidade, onEditOportunidade, onViewOportunidade }) {
  const [oportunidades, setOportunidades] = useState([])
  const [search, setSearch] = useState('')
  const [etapaFilter, setEtapaFilter] = useState('')
  const [responsavelFilter, setResponsavelFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOportunidades = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchOportunidades({ usuarioId: responsavelFilter || undefined })
      setOportunidades(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [responsavelFilter])

  useEffect(() => {
    loadOportunidades()
  }, [loadOportunidades])

  const etapas = useMemo(() => {
    return [...new Set(oportunidades.map((item) => item.etapa).filter(Boolean))]
  }, [oportunidades])

  const filteredOportunidades = useMemo(() => {
    const term = search.trim().toLowerCase()
    return oportunidades.filter((oportunidade) => {
      const matchesSearch =
        !term ||
        oportunidade.titulo?.toLowerCase().includes(term) ||
        oportunidade.lead?.toLowerCase().includes(term) ||
        oportunidade.responsavel?.toLowerCase().includes(term)
      const matchesEtapa = !etapaFilter || oportunidade.etapa === etapaFilter
      return matchesSearch && matchesEtapa
    })
  }, [oportunidades, search, etapaFilter])

  const handleDelete = async (oportunidade) => {
    const confirmed = window.confirm(`Excluir a oportunidade "${oportunidade.titulo}"?`)
    if (!confirmed) return
    try {
      await deleteOportunidade(oportunidade.id)
      await loadOportunidades()
    } catch (requestError) {
      window.alert(requestError.message)
    }
  }

  return (
    <>
      <Header title="Oportunidades" subtitle="Gestão de oportunidades vinculadas aos leads do funil comercial" />
      <div className="toolbar">
        <div className="searchBox">
          <Search size={18} />
          <input
            placeholder="Buscar oportunidade..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <FiltroResponsavel value={responsavelFilter} onChange={setResponsavelFilter} />
        <select value={etapaFilter} onChange={(event) => setEtapaFilter(event.target.value)}>
          <option value="">Todas as etapas</option>
          {etapas.map((etapa) => (
            <option key={etapa} value={etapa}>
              {etapa}
            </option>
          ))}
        </select>
        <button className="primaryBtn" onClick={onNewOportunidade}>
          <Plus size={18} />
          Nova Oportunidade
        </button>
      </div>
      {error && <p className="formError">{error}</p>}
      <div className="tableCard">
        {loading ? (
          <p className="tableMessage">Carregando oportunidades...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Lead</th>
                <th>Responsável</th>
                <th>Prioridade</th>
                <th>Etapa</th>
                <th>Valor estimado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOportunidades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="tableMessage">
                    Nenhuma oportunidade encontrada.
                  </td>
                </tr>
              ) : (
                filteredOportunidades.map((oportunidade) => (
                  <tr key={oportunidade.id}>
                    <td>
                      <div className="tableTitleCell">
                        <span>{oportunidade.titulo}</span>
                        <TarefaPendenteTag
                          count={oportunidade.tarefasPendentes}
                          prazoMaisProximo={oportunidade.prazoMaisProximo}
                        />
                      </div>
                    </td>
                    <td>{oportunidade.lead}</td>
                    <td>{oportunidade.responsavel}</td>
                    <td>
                      <span className={`priority ${getPriorityClass(oportunidade.prioridade)}`}>
                        {oportunidade.prioridade}
                      </span>
                    </td>
                    <td>{oportunidade.etapa}</td>
                    <td>{oportunidade.valor}</td>
                    <td className="actions">
                      <Eye size={16} onClick={() => onViewOportunidade(oportunidade.id)} />
                      <Edit size={16} onClick={() => onEditOportunidade(oportunidade.id)} />
                      <Trash2 size={16} onClick={() => handleDelete(oportunidade)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Oportunidades
