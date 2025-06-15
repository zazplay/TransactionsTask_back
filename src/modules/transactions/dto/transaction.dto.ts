import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, Min, IsUUID, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { TransactionStatus } from '../../../schemas/transaction.schema';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Сумма транзакции',
    example: 150.5,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Сумма должна быть числом' })
  @Min(0, { message: 'Сумма не может быть отрицательной' })
  @IsNotEmpty({ message: 'Сумма обязательна' })
  amount: number;

  @ApiProperty({
    description: 'Статус транзакции',
    enum: TransactionStatus,
    example: TransactionStatus.SUCCESS,
  })
  @IsEnum(TransactionStatus, { message: 'Статус должен быть одним из: success, pending, failed' })
  @IsNotEmpty({ message: 'Статус обязателен' })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Дата транзакции в формате ISO 8601',
    example: '2024-01-01T12:00:00Z',
  })
  @IsDateString({}, { message: 'Дата должна быть в формате ISO 8601' })
  @IsNotEmpty({ message: 'Дата обязательна' })
  date: string;

  @ApiPropertyOptional({
    description: 'Описание транзакции',
    example: 'Оплата товара',
  })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Валюта транзакции',
    example: 'USD',
  })
  @IsOptional()
  @IsString({ message: 'Валюта должна быть строкой' })
  currency?: string;
}

export class UpdateTransactionDto {
  @ApiPropertyOptional({
    description: 'Сумма транзакции',
    example: 150.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Сумма должна быть числом' })
  @Min(0, { message: 'Сумма не может быть отрицательной' })
  amount?: number;

  @ApiPropertyOptional({
    description: 'Статус транзакции',
    enum: TransactionStatus,
    example: TransactionStatus.SUCCESS,
  })
  @IsOptional()
  @IsEnum(TransactionStatus, { message: 'Статус должен быть одним из: success, pending, failed' })
  status?: TransactionStatus;

  @ApiPropertyOptional({
    description: 'Дата транзакции в формате ISO 8601',
    example: '2024-01-01T12:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Дата должна быть в формате ISO 8601' })
  date?: string;

  @ApiPropertyOptional({
    description: 'Описание транзакции',
    example: 'Оплата товара',
  })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Валюта транзакции',
    example: 'USD',
  })
  @IsOptional()
  @IsString({ message: 'Валюта должна быть строкой' })
  currency?: string;
}

export class TransactionQueryDto {
  @ApiPropertyOptional({
    description: 'Фильтр по статусу',
    enum: TransactionStatus,
    example: TransactionStatus.SUCCESS,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiPropertyOptional({
    description: 'Минимальная сумма',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Минимальная сумма должна быть числом' })
  @Min(0, { message: 'Минимальная сумма не может быть отрицательной' })
  amount_min?: number;

  @ApiPropertyOptional({
    description: 'Максимальная сумма',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Максимальная сумма должна быть числом' })
  @Min(0, { message: 'Максимальная сумма не может быть отрицательной' })
  amount_max?: number;

  @ApiPropertyOptional({
    description: 'Дата начала периода в формате ISO 8601',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Дата начала должна быть в формате ISO 8601' })
  date_from?: string;

  @ApiPropertyOptional({
    description: 'Дата окончания периода в формате ISO 8601',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Дата окончания должна быть в формате ISO 8601' })
  date_to?: string;

  @ApiPropertyOptional({
    description: 'Номер страницы для пагинации',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Номер страницы должен быть числом' })
  @Min(1, { message: 'Номер страницы должен быть больше 0' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Лимит должен быть числом' })
  @Min(1, { message: 'Лимит должен быть больше 0' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Поле для сортировки',
    example: '-date',
    enum: ['date', '-date', 'amount', '-amount'],
  })
  @IsOptional()
  @IsIn(['date', '-date', 'amount', '-amount'], { 
    message: 'Сортировка должна быть одной из: date, -date, amount, -amount' 
  })
  sort?: string = '-date';
}
