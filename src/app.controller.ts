import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Общие')
@Controller()
export class AppController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: 'Проверка работоспособности API' })
  @ApiResponse({ 
    status: 200, 
    description: 'API работает',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string' },
        version: { type: 'string' },
      },
    },
  })
  getHealth() {
    return {
      message: 'Transactions API успешно запущен',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
