import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import Metric from '../components/common/Metric'
import { fetchDashboardStats } from '../services/dashboardService'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchDashboardStats()
        setStats(data)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

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
          <select disabled>
            <option>Últimos 6 meses (leads)</option>
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
          <h2>Leads por mês</h2>
          <div className="barChart">
            {stats.leadsPorMes.map((item) => (
              <div key={item.label} className="barGroup">
                <div style={{ height: `${item.height}%` }} className="bar" />
                <span>{item.label}</span>
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
