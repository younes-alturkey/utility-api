import {
  Bind,
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Mock')
@Controller('mock')
export class MockController {
  @Get()
  @Bind(Res(), Query())
  @ApiOperation({
    summary: 'Mock response',
    description:
      'Returns a customizable mock response. Pass status, delay, and body as query parameters.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Number,
    description: 'HTTP status code to return (default: 200)',
  })
  @ApiQuery({
    name: 'delay',
    required: false,
    type: Number,
    description: 'Delay in milliseconds before responding (default: 0)',
  })
  @ApiQuery({
    name: 'body',
    required: false,
    type: String,
    description: 'Stringified JSON to return as the response body',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the mock response with the specified body.',
  })
  async mock(res, query) {
    const status = parseInt(query.status, 10) || 200
    const delay = parseInt(query.delay, 10) || 0
    const bodyStr = query.body

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    let responseBody = {}
    if (bodyStr) {
      try {
        responseBody = JSON.parse(bodyStr)
      } catch {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid JSON in body parameter',
        })
      }
    }

    return res.status(status).json(responseBody)
  }
}
