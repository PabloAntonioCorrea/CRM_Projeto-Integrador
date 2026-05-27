import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import Header from '../components/layout/Header'
import FunilColuna from '../components/funil/FunilColuna'
import ModalMarcarPerdida from '../components/oportunidades/ModalMarcarPerdida'
import { fetchEtapasFunil } from '../services/etapasService'
import { fetchOportunidadesFunil, updateOportunidade } from '../services/oportunidadesService'
import {
  ETAPA_PERDIDA,
  buildUpdatePayload,
  findEtapaOrigem,
  moveOportunidadeNoFunil,
  resolveEtapaDestino,
} from '../utils/funilDrag'
import { getPriorityClass } from '../utils/priorityClass'

const stageAverageDays = {
  Prospecção: 3,
  Qualificação: 5,
  Diagnóstico: 4,
  Proposta: 7,
  Negociação: 6,
  Fechado: 2,
  Perdida: 0,
}

const etapasSemTempoMedio = new Set(['Fechado', 'Perdida'])

function FunilOverlayCard({ oportunidade }) {
  return (
    <div className="opCard opCardOverlay">
      <h3>{oportunidade.titulo}</h3>
      <p>{oportunidade.lead}</p>
      <div className="cardMeta">
        <span>{oportunidade.responsavel}</span>
        <span className={`priority ${getPriorityClass(oportunidade.prioridade)}`}>
          {oportunidade.prioridade}
        </span>
      </div>
      <strong>{oportunidade.valor}</strong>
    </div>
  )
}

function Funil({ onNewOportunidade, onViewOportunidade, onEditOportunidade, currentUser }) {
  const [funil, setFunil] = useState({})
  const [etapas, setEtapas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCard, setActiveCard] = useState(null)
  const [moving, setMoving] = useState(false)
  const [perdidaModal, setPerdidaModal] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const loadFunil = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [funilData, etapasData] = await Promise.all([
        fetchOportunidadesFunil(),
        fetchEtapasFunil(),
      ])
      setFunil(funilData)
      setEtapas(etapasData)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFunil()
  }, [loadFunil])

  const etapasAtivas = useMemo(() => {
    const ordenadas = etapas.map((etapa) => etapa.nome)
    const extras = Object.keys(funil).filter((nome) => !ordenadas.includes(nome))
    return [...ordenadas, ...extras]
  }, [etapas, funil])

  const etapaIdPorNome = useMemo(() => {
    const map = {}
    for (const etapa of etapas) {
      map[etapa.nome] = etapa.id
    }
    return map
  }, [etapas])

  const bottleneckDays = useMemo(() => {
    return Math.max(
      ...etapasAtivas
        .filter((etapa) => !etapasSemTempoMedio.has(etapa))
        .map((etapa) => stageAverageDays[etapa] ?? 0),
      0
    )
  }, [etapasAtivas])

  const findOportunidade = useCallback(
    (oportunidadeId) => {
      for (const etapa of etapasAtivas) {
        const item = (funil[etapa] ?? []).find((o) => String(o.id) === String(oportunidadeId))
        if (item) return item
      }
      return null
    },
    [funil, etapasAtivas]
  )

  const aplicarMudancaEtapa = useCallback(
    async (oportunidade, etapaOrigem, etapaDestino) => {
      const etapaFunilId = etapaIdPorNome[etapaDestino]
      if (!etapaFunilId) {
        setError('Etapa de destino não encontrada')
        return
      }

      const snapshot = funil
      setFunil((current) => moveOportunidadeNoFunil(current, oportunidade.id, etapaOrigem, etapaDestino))
      setMoving(true)
      setError('')

      try {
        const atualizada = await updateOportunidade(
          oportunidade.id,
          buildUpdatePayload(oportunidade, etapaFunilId)
        )
        setFunil((current) => {
          const next = moveOportunidadeNoFunil(current, oportunidade.id, etapaOrigem, etapaDestino)
          const lista = [...(next[etapaDestino] ?? [])]
          const idx = lista.findIndex((item) => String(item.id) === String(oportunidade.id))
          if (idx >= 0) lista[idx] = { ...lista[idx], ...atualizada, etapa: etapaDestino }
          return { ...next, [etapaDestino]: lista }
        })
      } catch (requestError) {
        setFunil(snapshot)
        setError(requestError.message)
      } finally {
        setMoving(false)
      }
    },
    [funil, etapaIdPorNome]
  )

  const handleDragStart = (event) => {
    const oportunidade = event.active.data.current?.oportunidade ?? findOportunidade(event.active.id)
    setActiveCard(oportunidade ?? null)
  }

  const handleDragEnd = async (event) => {
    setActiveCard(null)
    const { active, over } = event
    if (!over || moving) return

    const etapaDestino = resolveEtapaDestino(over.id, funil, etapasAtivas)
    const etapaOrigem = findEtapaOrigem(active.id, funil, etapasAtivas)
    if (!etapaDestino || !etapaOrigem || etapaDestino === etapaOrigem) return

    const oportunidade = active.data.current?.oportunidade ?? findOportunidade(active.id)
    if (!oportunidade) return

    if (etapaDestino === ETAPA_PERDIDA) {
      setPerdidaModal({ oportunidade, etapaOrigem })
      return
    }

    await aplicarMudancaEtapa(oportunidade, etapaOrigem, etapaDestino)
  }

  const handlePerdidaSuccess = async () => {
    setPerdidaModal(null)
    await loadFunil()
  }

  return (
    <>
      <Header title="Funil de Vendas" subtitle="Arraste as oportunidades entre as etapas" />
      <div className="toolbar">
        <button type="button" className="primaryBtn" onClick={onNewOportunidade}>
          <Plus size={18} />
          Nova Oportunidade
        </button>
      </div>
      {error && <p className="formError">{error}</p>}
      {moving && <p className="tableMessage">Atualizando etapa...</p>}
      {loading ? (
        <p className="tableMessage">Carregando funil...</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="kanbanBoard">
            <section className="kanban">
              {etapasAtivas.map((etapa) => {
                const diasMedios = stageAverageDays[etapa] ?? 0
                const isPerdida = etapa === ETAPA_PERDIDA
                const isBottleneck =
                  !etapasSemTempoMedio.has(etapa) &&
                  diasMedios === bottleneckDays &&
                  bottleneckDays > 0

                return (
                  <FunilColuna
                    key={etapa}
                    etapa={etapa}
                    oportunidades={funil[etapa] ?? []}
                    isBottleneck={isBottleneck}
                    isPerdida={isPerdida}
                    diasMedios={diasMedios}
                    showTempoMedio={!etapasSemTempoMedio.has(etapa)}
                    onViewOportunidade={onViewOportunidade}
                    onEditOportunidade={onEditOportunidade}
                  />
                )
              })}
            </section>
          </div>
          <DragOverlay dropAnimation={null}>
            {activeCard ? <FunilOverlayCard oportunidade={activeCard} /> : null}
          </DragOverlay>
        </DndContext>
      )}
      {perdidaModal && (
        <ModalMarcarPerdida
          oportunidade={perdidaModal.oportunidade}
          currentUser={currentUser}
          onClose={() => setPerdidaModal(null)}
          onSuccess={handlePerdidaSuccess}
        />
      )}
    </>
  )
}

export default Funil
