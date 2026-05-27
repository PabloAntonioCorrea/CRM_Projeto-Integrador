export const formatValorFromCents = (cents) => {
  const amount = Number(cents) / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

export const formatValorFromAmount = (amount) => {
  const cents = Math.round(Number(amount) * 100)
  if (Number.isNaN(cents)) return ''
  return formatValorFromCents(cents)
}

export const maskValorInput = (inputValue) => {
  const digits = String(inputValue).replace(/\D/g, '')
  if (!digits) return ''
  return formatValorFromCents(digits)
}

export const parseValorInputToAmount = (maskedValue) => {
  const digits = String(maskedValue).replace(/\D/g, '')
  if (!digits) return 0
  return Number(digits) / 100
}
