import { Readable } from 'node:stream'
import ExcelJS from 'exceljs'

const normalizeHeader = (value) => {
  if (value === undefined || value === null) return ''
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
}

const headerAliases = {
  nome: 'nome',
  name: 'nome',
  email: 'email',
  e_mail: 'email',
  telefone: 'telefone',
  phone: 'telefone',
  empresa: 'empresa',
  company: 'empresa',
  cidade: 'cidade',
  city: 'cidade',
  nicho: 'nicho',
  observacoes: 'observacoes',
  observacao: 'observacoes',
  status: 'status',
  data_cadastro: 'data_cadastro',
  datacadastro: 'data_cadastro',
  responsavel: 'responsavel',
  responsavel_email: 'responsavel',
  email_responsavel: 'responsavel',
}

const getCellText = (cell) => {
  if (!cell || cell.value === undefined || cell.value === null) return ''
  if (typeof cell.value === 'object' && cell.value.text) return String(cell.value.text).trim()
  if (cell.value instanceof Date) return cell.value.toISOString().slice(0, 10)
  return String(cell.value).trim()
}

export const parseSpreadsheetRows = async (buffer, originalName = '') => {
  const workbook = new ExcelJS.Workbook()
  const lowerName = originalName.toLowerCase()

  if (lowerName.endsWith('.csv')) {
    await workbook.csv.read(Readable.from(buffer))
  } else {
    await workbook.xlsx.load(buffer)
  }

  const sheet = workbook.worksheets[0]
  if (!sheet || sheet.rowCount < 1) {
    return { headers: {}, rows: [] }
  }

  const headerMap = {}
  const headerRow = sheet.getRow(1)
  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const normalized = normalizeHeader(getCellText(cell))
    const field = headerAliases[normalized] ?? normalized
    if (field) headerMap[field] = colNumber
  })

  const rows = []
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber)
    const record = {}
    let hasValue = false

    Object.entries(headerMap).forEach(([field, colNumber]) => {
      const value = getCellText(row.getCell(colNumber))
      if (value) hasValue = true
      record[field] = value
    })

    if (hasValue) {
      rows.push({ line: rowNumber, data: record })
    }
  }

  return { headers: headerMap, rows }
}

export const buildLeadsImportTemplateBuffer = async () => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Leads')

  sheet.columns = [
    { header: 'nome', key: 'nome', width: 28 },
    { header: 'email', key: 'email', width: 28 },
    { header: 'telefone', key: 'telefone', width: 18 },
    { header: 'empresa', key: 'empresa', width: 24 },
    { header: 'cidade', key: 'cidade', width: 18 },
    { header: 'nicho', key: 'nicho', width: 18 },
    { header: 'status', key: 'status', width: 12 },
    { header: 'data_cadastro', key: 'data_cadastro', width: 16 },
    { header: 'responsavel', key: 'responsavel', width: 28 },
    { header: 'observacoes', key: 'observacoes', width: 36 },
  ]

  sheet.addRow({
    nome: 'João Martins',
    email: 'joao@techsul.com',
    telefone: '(55) 99999-0101',
    empresa: 'TechSul',
    cidade: 'Santa Maria',
    nicho: 'Tecnologia',
    status: 'Ativo',
    data_cadastro: '2026-01-10',
    responsavel: 'pablo@empresa.com',
    observacoes: 'Lead importado de exemplo',
  })

  sheet.getRow(1).font = { bold: true }
  return workbook.xlsx.writeBuffer()
}
