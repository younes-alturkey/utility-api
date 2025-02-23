import { KVService } from '@/kv/kv.service'
import {
  Bind,
  Body,
  Controller,
  Delete,
  Dependencies,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('KV') // Tag for grouping endpoints in Swagger documentation
@ApiTags('KV') // Tag for grouping endpoints in Swagger documentation
@Controller('kv') // Base route for all endpoints in this controller
@Dependencies(KVService) // Injects the KVService dependency
export class KVController {
  constructor(kvService) {
    this.kvService = kvService // Initializes KVService instance
  }

  @Get() // Handles GET requests to /kv
  @Bind(Res(), Query()) // Binds the response object
  @ApiOperation({ summary: 'Get key value data' }) // Describes the endpoint
  @ApiResponse({
    status: 200,
    description: 'Returns the data of a key value pair.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getKeyValue(res, query) {
    return await this.kvService.getKeyValue(res, query) // Fetches all users data
  }

  @Post() // Handles POST requests to /kv
  @Bind(Res(), Query(), Body()) // Binds response, query, and body objects
  @ApiOperation({ summary: 'Add key value data' }) // Describes the endpoint
  @ApiBody({ description: 'Key value data', required: true }) // Describes body parameters
  @ApiQuery({
    key: 'key',
    description: 'Key for the key value pair',
    required: true,
  }) // Describes query parameters
  @ApiResponse({
    status: 200,
    description: 'Key value data added successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async addKeyValue(res, query, body) {
    return await this.kvService.addKeyValue(res, body, query) // Handles key value pair registration logic
  }

  @Delete() // Handles DELETE requests to /kv
  @Bind(Res(), Query()) // Binds the response object
  @ApiOperation({ summary: 'Delete key value data' }) // Describes the endpoint
  @ApiResponse({
    status: 200,
    description: 'Key value data deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({
    key: 'key',
    description: 'Key for the key value pair',
    required: true,
  }) // Describes query parameters
  async deleteKeyValue(res, query) {
    return await this.kvService.deleteKeyValue(res, query) // Handles key value pair deletion logic
  }

  @Get('all') // Handles GET requests to /kv/all
  @Bind(Res()) // Binds the response object
  @ApiOperation({ summary: 'Get all key value store data' }) // Describes the endpoint
  @ApiResponse({
    status: 200,
    description: 'Returns the list of all key value pairs.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getAllKeyValue(res) {
    return await this.kvService.getAllKeyValue(res) // Fetches all users data
  }
}
