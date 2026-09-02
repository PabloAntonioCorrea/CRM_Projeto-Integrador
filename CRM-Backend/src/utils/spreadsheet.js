// ===== IMPORTS =====
import { Readable } from 'node:stream'
import ExcelJS from 'exceljs'

// ===== CONFIGURATIONS =====
const headerAliases = {
  nome: 'nome',
  name: 'nome',
  nome_completo: 'nome',
  nome_do_lead: 'nome',
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

// ===== UTILITIES =====
const normalizeHeader = (value) => {
  if (value === undefined || value === null) return ''
  return String(value)
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\-–—]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const stripBom = (text) => {
  if (text.charCodeAt(0) === 0xfeff) return text.slice(1)
  return text
}

const decodeSpreadsheetText = (buffer) => {
  const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)

  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.subarray(2).toString('utf16le')
  }

  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    const swapped = Buffer.alloc(buf.length - 2)
    for (let index = 2; index + 1 < buf.length; index += 2) {
      swapped[index - 2] = buf[index + 1]
      swapped[index - 1] = buf[index]
    }
    return swapped.toString('utf16le')
  }

  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return stripBom(buf.toString('utf8'))
  }

  try {
    return stripBom(new TextDecoder('utf-8', { fatal: true }).decode(buf))
  } catch {
    return stripBom(new TextDecoder('windows-1252').decode(buf))
  }
}

const detectCsvDelimiter = (text) => {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) ?? ''
  const commas = (firstLine.match(/,/g) ?? []).length
  const semicolons = (firstLine.match(/;/g) ?? []).length
  const tabs = (firstLine.match(/\t/g) ?? []).length

  if (tabs > commas && tabs > semicolons) return '\t'
  if (semicolons > commas) return ';'
  return ','
}

const getCellText = (cell) => {
  if (!cell || cell.value === undefined || cell.value === null) return ''
  if (typeof cell.value === 'object' && cell.value.text) return String(cell.value.text).trim()
  if (cell.value instanceof Date) return cell.value.toISOString().slice(0, 10)
  return String(cell.value).trim()
}

const buildRowsFromSheet = (sheet) => {
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

const parseCsvWithExcelJs = async (text, delimiter) => {
  const workbook = new ExcelJS.Workbook()
  await workbook.csv.read(Readable.from(Buffer.from(text, 'utf8')), {
    parserOptions: { delimiter },
  })
  return buildRowsFromSheet(workbook.worksheets[0])
}

const splitCsvLine = (line, delimiter) => {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  cells.push(current.trim())
  return cells
}

const parseCsvManually = (text, delimiter) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    return { headers: {}, rows: [] }
  }

  const headerCells = splitCsvLine(lines[0], delimiter)
  const headerMap = {}
  headerCells.forEach((header, index) => {
    const normalized = normalizeHeader(header)
    const field = headerAliases[normalized] ?? normalized
    if (field) headerMap[field] = index
  })

  const rows = []
  for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
    const cells = splitCsvLine(lines[lineIndex], delimiter)
    const record = {}
    let hasValue = false

    Object.entries(headerMap).forEach(([field, colIndex]) => {
      const value = String(cells[colIndex] ?? '').trim()
      if (value) hasValue = true
      record[field] = value
    })

    if (hasValue) {
      rows.push({ line: lineIndex + 1, data: record })
    }
  }

  return { headers: headerMap, rows }
}

// ===== HELPERS =====
export const parseSpreadsheetRows = async (buffer, originalName = '') => {
  const lowerName = originalName.toLowerCase()

  if (lowerName.endsWith('.csv')) {
    const text = decodeSpreadsheetText(buffer)
    const delimiter = detectCsvDelimiter(text)
    const parsed = await parseCsvWithExcelJs(text, delimiter)
    if (parsed.headers.nome) return parsed
    return parseCsvManually(text, delimiter)
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  return buildRowsFromSheet(workbook.worksheets[0])
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
    responsavel: 'admin@empresa.com',
    observacoes: 'Lead importado de exemplo',
  })

  sheet.getRow(1).font = { bold: true }
  return workbook.xlsx.writeBuffer()
}
