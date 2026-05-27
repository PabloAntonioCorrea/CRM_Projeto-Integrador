import multer from 'multer'
import { ErrorMessages } from '../config/constants.js'

const storage = multer.memoryStorage()

export const uploadSpreadsheet = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    const isAllowed = /\.(xlsx|xls|csv)$/i.test(file.originalname)
    if (!isAllowed) {
      callback(new Error(ErrorMessages.importFileInvalid))
      return
    }
    callback(null, true)
  },
})
