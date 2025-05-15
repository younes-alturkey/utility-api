import { UtilityService } from '@/utility/utility.service.js'
import {
  Bind,
  Controller,
  Dependencies,
  Get,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Utility')
@Controller('utility')
@Dependencies(UtilityService)
export class UtilityController {
  constructor(utilityService) {
    this.utilityService = utilityService
  }

  @Get('download')
  @Bind(Res(), Query())
  @ApiOperation({ summary: 'Download file from URL' })
  @ApiQuery({
    name: 'url',
    description: 'URL of the file to download',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File downloaded successfully',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async downloadFile(res, query) {
    return this.utilityService.downloadFile(res, query)
  }
}
