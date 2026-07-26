import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Verificar disponibilidade da API' })
  @ApiOkResponse({
    description: 'API disponivel.',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
