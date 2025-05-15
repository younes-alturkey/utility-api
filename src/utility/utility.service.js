import { HttpStatus, Injectable } from '@nestjs/common'
import fetch from 'node-fetch'

@Injectable()
export class UtilityService {
  async downloadFile(res, query) {
    try {
      if (!query.url) {
        throw {
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: 'URL is required',
        }
      }

      const response = await fetch(query.url)

      if (!response.ok) {
        throw {
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: 'Failed to download file',
        }
      }

      const contentType =
        response.headers.get('content-type') || 'application/octet-stream'
      const contentDisposition =
        response.headers.get('content-disposition') ||
        'attachment; filename="downloaded-file"'

      res.setHeader('Content-Type', contentType)
      res.setHeader('Content-Disposition', contentDisposition)

      response.body.pipe(res)
    } catch (error) {
      console.error('Error in downloading file: ', error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Something went wrong',
        raw: error?.toString() || 'No raw error message available.',
      })
    }
  }
}
