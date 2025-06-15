import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto, TransactionQueryDto } from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ITransactionResponse, IPaginatedTransactions } from '../../interfaces/transaction.interface';

@ApiTags('Транзакции')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение списка транзакций с фильтрацией и пагинацией' })
  @ApiQuery({ name: 'status', required: false, enum: ['success', 'pending', 'failed'] })
  @ApiQuery({ name: 'amount_min', required: false, type: Number })
  @ApiQuery({ name: 'amount_max', required: false, type: Number })
  @ApiQuery({ name: 'date_from', required: false, type: String })
  @ApiQuery({ name: 'date_to', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['date', '-date', 'amount', '-amount'] })
  @ApiResponse({
    status: 200,
    description: 'Список транзакций получен',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              id: { type: 'string' },
              amount: { type: 'number' },
              status: { type: 'string', enum: ['success', 'pending', 'failed'] },
              date: { type: 'string', format: 'date-time' },
              description: { type: 'string' },
              currency: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Неверные параметры запроса' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async findAll(@Query() query: TransactionQueryDto): Promise<IPaginatedTransactions> {
    return this.transactionsService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Создание новой транзакции (ID генерируется автоматически)' })
  @ApiResponse({
    status: 201,
    description: 'Транзакция успешно создана',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        id: { type: 'string', description: 'Автоматически сгенерированный UUID' },
        amount: { type: 'number' },
        status: { type: 'string', enum: ['success', 'pending', 'failed'] },
        date: { type: 'string', format: 'date-time' },
        description: { type: 'string' },
        currency: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<ITransactionResponse> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Получение всех транзакций с пагинацией (без фильтрации)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы (по умолчанию: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество на странице (по умолчанию: 10)' })
  @ApiResponse({
    status: 200,
    description: 'Список всех транзакций получен',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              id: { type: 'string' },
              amount: { type: 'number' },
              status: { type: 'string', enum: ['success', 'pending', 'failed'] },
              date: { type: 'string', format: 'date-time' },
              description: { type: 'string' },
              currency: { type: 'string' },
            },
          },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async getAllTransactions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<IPaginatedTransactions> {
    return this.transactionsService.getAllTransactions(page, limit);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Получение статистики по транзакциям' })
  @ApiResponse({
    status: 200,
    description: 'Статистика получена',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'object',
          properties: {
            totalAmount: { type: 'number' },
            averageAmount: { type: 'number' },
            totalTransactions: { type: 'number' },
            minAmount: { type: 'number' },
            maxAmount: { type: 'number' },
          },
        },
        byStatus: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              count: { type: 'number' },
              totalAmount: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async getStatistics() {
    return this.transactionsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение транзакции по ID' })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор транзакции',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Транзакция найдена',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        id: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string', enum: ['success', 'pending', 'failed'] },
        date: { type: 'string', format: 'date-time' },
        description: { type: 'string' },
        currency: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Транзакция не найдена' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async findOne(@Param('id') id: string): Promise<ITransactionResponse> {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновление транзакции' })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор транзакции',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Транзакция обновлена',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        id: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string', enum: ['success', 'pending', 'failed'] },
        date: { type: 'string', format: 'date-time' },
        description: { type: 'string' },
        currency: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Транзакция не найдена' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<ITransactionResponse> {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удаление транзакции' })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор транзакции',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Транзакция удалена' })
  @ApiResponse({ status: 404, description: 'Транзакция не найдена' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.transactionsService.remove(id);
  }
}
