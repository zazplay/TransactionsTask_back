import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { CreateTransactionDto, UpdateTransactionDto, TransactionQueryDto } from './dto/transaction.dto';
import { ITransactionResponse, IPaginatedTransactions } from '../../interfaces/transaction.interface';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<ITransactionResponse> {
    const transactionId = uuidv4();

    const createdTransaction = new this.transactionModel({
      ...createTransactionDto,
      id: transactionId,
      date: new Date(createTransactionDto.date),
    });

    const savedTransaction = await createdTransaction.save();
    return this.toTransactionResponse(savedTransaction);
  }

  async findAll(query: TransactionQueryDto): Promise<IPaginatedTransactions> {
    const filter: any = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.amount_min !== undefined || query.amount_max !== undefined) {
      filter.amount = {};
      if (query.amount_min !== undefined) {
        filter.amount.$gte = query.amount_min;
      }
      if (query.amount_max !== undefined) {
        filter.amount.$lte = query.amount_max;
      }
    }

    if (query.date_from || query.date_to) {
      filter.date = {};
      if (query.date_from) {
        filter.date.$gte = new Date(query.date_from);
      }
      if (query.date_to) {
        filter.date.$lte = new Date(query.date_to);
      }
    }

    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100); 
    const skip = (page - 1) * limit;

    const sortOrder: any = {};
    if (query.sort) {
      const field = query.sort.startsWith('-') ? query.sort.substring(1) : query.sort;
      const direction = query.sort.startsWith('-') ? -1 : 1;
      sortOrder[field] = direction;
    } else {
      sortOrder.date = -1; 
    }

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: transactions.map(transaction => this.toTransactionResponse(transaction)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<ITransactionResponse> {
    const transaction = await this.transactionModel.findOne({ id }).exec();
    if (!transaction) {
      throw new NotFoundException(`Транзакция с ID ${id} не найдена`);
    }
    return this.toTransactionResponse(transaction);
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<ITransactionResponse> {
    const updateData: any = { ...updateTransactionDto };
    
    if (updateTransactionDto.date) {
      updateData.date = new Date(updateTransactionDto.date);
    }

    const updatedTransaction = await this.transactionModel
      .findOneAndUpdate({ id }, updateData, { new: true })
      .exec();

    if (!updatedTransaction) {
      throw new NotFoundException(`Транзакция с ID ${id} не найдена`);
    }

    return this.toTransactionResponse(updatedTransaction);
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Транзакция с ID ${id} не найдена`);
    }
  }

  async getStatistics() {
    const [totalStats, statusStats] = await Promise.all([
      this.transactionModel.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            averageAmount: { $avg: '$amount' },
            totalTransactions: { $sum: 1 },
            minAmount: { $min: '$amount' },
            maxAmount: { $max: '$amount' },
          },
        },
      ]).exec(),
      this.transactionModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
      ]).exec(),
    ]);

    return {
      total: totalStats[0] || {
        totalAmount: 0,
        averageAmount: 0,
        totalTransactions: 0,
        minAmount: 0,
        maxAmount: 0,
      },
      byStatus: statusStats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          totalAmount: stat.totalAmount,
        };
        return acc;
      }, {}),
    };
  }

  async getAllTransactions(page: number = 1, limit: number = 10): Promise<IPaginatedTransactions> {
    const validLimit = Math.min(limit || 10, 100); 
    const skip = (page - 1) * validLimit;

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find({})
        .sort({ date: -1 }) 
        .skip(skip)
        .limit(validLimit)
        .exec(),
      this.transactionModel.countDocuments({}).exec(),
    ]);

    const totalPages = Math.ceil(total / validLimit);

    return {
      data: transactions.map(transaction => this.toTransactionResponse(transaction)),
      total,
      page,
      limit: validLimit,
      totalPages,
    };
  }

  private toTransactionResponse(transaction: TransactionDocument): ITransactionResponse {
    return {
      _id: (transaction._id as any).toString(),
      id: transaction.id,
      amount: transaction.amount,
      status: transaction.status,
      date: transaction.date,
      description: transaction.description,
      currency: transaction.currency,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
