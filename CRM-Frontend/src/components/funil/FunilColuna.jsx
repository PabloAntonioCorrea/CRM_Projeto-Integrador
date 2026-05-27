import { useDroppable } from '@dnd-kit/core'
import FunilCardArrastavel from './FunilCardArrastavel'

function FunilColuna({
  etapa,
  oportunidades,
  isBottleneck,
  isPerdida,
  diasMedios,
  showTempoMedio,
  onViewOportunidade,
  onEditOportunidade,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: etapa,
    data: { etapa },
  })

  return (
    <div
      ref={setNodeRef}
      className={`kanbanCol ${isBottleneck ? 'bottleneck' : ''} ${isPerdida ? 'kanbanColPerdida' : ''} ${isOver ? 'kanbanColOver' : ''}`}
    >
      <div className="kanbanHeader">
        <strong>{etapa}</strong>
        <span>{oportunidades.length}</span>
      </div>
      {showTempoMedio ? (
        <div className={`stageTimeTag ${diasMedios >= 7 ? 'high' : diasMedios >= 5 ? 'medium' : 'low'}`}>
          {diasMedios} dias médios
        </div>
      ) : (
        <div className="stageTimeTag low">{isPerdida ? 'Encerradas' : 'Ganhas'}</div>
      )}
      {oportunidades.map((oportunidade) => (
        <FunilCardArrastavel
          key={oportunidade.id}
          oportunidade={oportunidade}
          onViewOportunidade={onViewOportunidade}
          onEditOportunidade={onEditOportunidade}
        />
      ))}
    </div>
  )
}

export default FunilColuna
