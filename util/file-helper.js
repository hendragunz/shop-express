import * as fs from 'fs'

export const deleteFile = (filePath) => {
  fs.unlink("." + filePath,(err) => {
    if (err) {
      throw (err)
    }
  })
}