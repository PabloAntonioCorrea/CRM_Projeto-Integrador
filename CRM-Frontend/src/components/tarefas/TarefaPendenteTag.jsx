import { getTarefaPendenteLabel, getTarefaPendenteTitle } from '../../utils/tarefaTag.js'

function TarefaPendenteTag({ count, prazoMaisProximo }) {
  if (!count) return null

  return (
    <span className="tag task" title={getTarefaPendenteTitle(count, prazoMaisProximo)}>
      {getTarefaPendenteLabel(count)}
    </span>
  )
}

export default TarefaPendenteTag
