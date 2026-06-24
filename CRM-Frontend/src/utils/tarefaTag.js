export const getTarefaPendenteLabel = (count) => {
  const total = Number(count) || 0
  if (total === 1) return '1 Tarefa Pendente'
  if (total > 1) return `${total} Tarefas Pendentes`
  return ''
}

export const getTarefaPendenteTitle = (count, prazoMaisProximo) => {
  if (!count) return ''
  const label = getTarefaPendenteLabel(count)
  if (!prazoMaisProximo) return label
  return `${label} · Prazo mais próximo: ${prazoMaisProximo}`
}
