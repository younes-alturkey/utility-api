import { ProxyService } from '@/proxy/proxy.service'
import {
  Bind,
  Body,
  Controller,
  Dependencies,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Proxy')
@Controller('proxy')
@Dependencies(ProxyService)
export class ProxyController {
  constructor(proxyService) {
    this.proxyService = proxyService
  }

  @Post()
  @Bind(Res(), Body())
  @ApiOperation({
    summary: 'Proxy request',
    description:
      'Forward a request to the given URL. Supports GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS. Pass url, method, headers, query, and body in the request body.',
  })
  @ApiBody({
    description: 'Proxy request payload',
    required: true,
    schema: {
      type: 'object',
      required: ['url'],
      properties: {
        url: { type: 'string', description: 'Target URL to call' },
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
          default: 'GET',
        },
        headers: {
          type: 'object',
          description: 'HTTP headers to send',
          additionalProperties: { type: 'string' },
        },
        query: {
          type: 'object',
          description: 'Query parameters (merged into URL)',
          additionalProperties: true,
        },
        body: {
          description: 'Request body (for POST, PUT, PATCH)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the proxied response (status, headers, data).',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async proxy(res, body) {
    try {
      const result = await this.proxyService.proxy({
        url: body?.url,
        method: body?.method,
        headers: body?.headers,
        query: body?.query,
        body: body?.body,
      })
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      const status = error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      return res.status(status).json({
        success: false,
        status,
        message: error.message ?? 'Proxy request failed',
      })
    }
  }
}
