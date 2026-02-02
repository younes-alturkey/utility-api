import { HttpStatus, Injectable } from '@nestjs/common'

const ALLOWED_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
]

@Injectable()
export class ProxyService {
  /**
   * Build URL with query params
   */
  buildUrl(baseUrl, query = {}) {
    const url = new URL(baseUrl)
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
    return url.toString()
  }

  /**
   * Proxy a request to the given URL with the specified method, headers, body, and query params.
   * Returns the remote response status, headers, and body.
   */
  async proxy({ url, method = 'GET', headers = {}, query = {}, body }) {
    if (!url || typeof url !== 'string') {
      throw {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: 'url is required and must be a string',
      }
    }

    const normalizedMethod = (method || 'GET').toUpperCase()
    if (!ALLOWED_METHODS.includes(normalizedMethod)) {
      throw {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: `method must be one of: ${ALLOWED_METHODS.join(', ')}`,
      }
    }

    const targetUrl = this.buildUrl(url, query)

    const fetchOptions = {
      method: normalizedMethod,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    const hasBody = ['POST', 'PUT', 'PATCH'].includes(normalizedMethod) && body !== undefined
    if (hasBody) {
      fetchOptions.body =
        typeof body === 'string' ? body : JSON.stringify(body)
    }

    const response = await fetch(targetUrl, fetchOptions)

    const responseHeaders = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    let responseBody
    const contentType = response.headers.get('content-type') || ''
    const text = await response.text()
    if (text && contentType.includes('application/json')) {
      try {
        responseBody = JSON.parse(text)
      } catch {
        responseBody = text
      }
    } else {
      responseBody = text
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: responseBody,
    }
  }
}
