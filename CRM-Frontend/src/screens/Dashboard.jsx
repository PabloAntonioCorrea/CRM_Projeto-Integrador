import { useCallback, useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import Metric from '../components/common/Metric'
import { fetchDashboardStats } from '../services/dashboardService'

const PeriodoOptions = [
  { value: 3, label: 'Últimos 3 meses' },
  { value: 6, label: 'Últimos 6 meses' },
  { value: 12, label: 'Últimos 12 meses' },
]

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [meses, setMeses] = useState(6)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadStats = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchDashboardStats(meses)
      setStats(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [meses])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  if (loading) {
    return (
      <>
        <Header title="Dashboard" subtitle="Resumo geral do desempenho comercial" />
        <p className="tableMessage">Carregando indicadores...</p>
      </>
    )
  }

  if (error || !stats) {
    return (
      <>
        <Header title="Dashboard" subtitle="Resumo geral do desempenho comercial" />
        <p className="formError">{error || 'Não foi possível carregar o dashboard.'}</p>
      </>
    )
  }

  return (
    <>
      <Header title="Dashboard" subtitle="Resumo geral do desempenho comercial" />
      <section className="filtersPanel">
        <label>
          <span>Período</span>
          <select value={meses} onChange={(event) => setMeses(Number(event.target.value))}>
            {PeriodoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>
      <section className="cardsGrid">
        <Metric title="Total de Leads" value={String(stats.totalLeads)} change={`${stats.leadsAtivos} ativos`} />
        <Metric
          title="Oportunidades em Aberto"
          value={String(stats.oportunidadesAbertas)}
          change={`${stats.emNegociacao} em negociação`}
        />
        <Metric title="Taxa de Conversão" value={`${stats.taxaConversao}%`} change="Oportunidades fechadas" />
        <Metric
          title="Valor total em vendas fechadas"
          value={stats.vendasFechadas.valor}
          change={`${stats.vendasFechadas.quantidade} vendas concluídas`}
        />
      </section>
      <section className="gridTwo">
        <div className="panel">
          <h2>Leads por mês (últimos {stats.meses ?? meses} meses)</h2>
          <div className="barChart">
            {stats.leadsPorMes.map((item) => (
              <div key={`${item.label}-${item.count}`} className="barGroup">
                <span className={`barCount ${item.count === 0 ? 'barCountEmpty' : ''}`}>
                  {item.count}
                </span>
                <div className="barTrack">
                  {item.count > 0 && (
                    <div className="bar" style={{ height: `${item.height}%` }} />
                  )}
                </div>
                <span className="barLabel">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Separação de leads: Ativo x Inativo</h2>
          <div className="leadStatusList">
            <div className="leadStatusRow">
              <div className="leadStatusInfo">
                <span>Ativos</span>
                <strong>{stats.leadsAtivos} leads</strong>
              </div>
              <div className="leadStatusBar">
                <div className="leadStatusFill active" style={{ width: `${stats.ativosPercentual}%` }} />
              </div>
              <small>{stats.ativosPercentual}%</small>
            </div>
            <div className="leadStatusRow">
              <div className="leadStatusInfo">
                <span>Inativos</span>
                <strong>{stats.leadsInativos} leads</strong>
              </div>
              <div className="leadStatusBar">
                <div className="leadStatusFill passive" style={{ width: `${stats.passivosPercentual}%` }} />
              </div>
              <small>{stats.passivosPercentual}%</small>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Dashboard
