import { applyDecorators } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath
} from '@nestjs/swagger'
import { ApiResponseDto } from '../dto/api-response.dto'

export const ApiAppResponse = (model: any) =>
  applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) }
            }
          }
        ]
      }
    })
  )
