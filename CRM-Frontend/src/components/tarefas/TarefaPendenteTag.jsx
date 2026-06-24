import { getTarefaPendenteLabel, getTarefaPendenteTitle } from '../../utils/tarefaTag.js'

function TarefaPendenteTag({ count, prazoMaisProximo, onClick }) {
  if (!count) return null

  const label = getTarefaPendenteLabel(count)
  const title = onClick
    ? `${getTarefaPendenteTitle(count, prazoMaisProximo)} — clique para ver`
    : getTarefaPendenteTitle(count, prazoMaisProximo)

  if (onClick) {
    return (
      <button type="button" className="tag task tagBtn" title={title} onClick={onClick}>
        {label}
      </button>
    )
  }

  return (
    <span className="tag task" title={title}>
      {label}
    </span>
  )
}

export default TarefaPendenteTag
