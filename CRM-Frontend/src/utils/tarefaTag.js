export const getTarefaPendenteLabel = (count) => {
  if (count === 1) return '1 tarefa pendente'
  return `${count} tarefas pendentes`
}

export const getTarefaPendenteTitle = (count, prazoMaisProximo) => {
  if (!count) return ''
  const label = getTarefaPendenteLabel(count)
  if (!prazoMaisProximo) return label
  return `${label} · Prazo mais próximo: ${prazoMaisProximo}`
}
