import { TransactionStatus } from '../schemas/transaction.schema';

export interface ITransaction {
  _id?: string;
  id: string;
  amount: number;
  status: TransactionStatus;
  date: Date;
  description?: string;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransactionResponse {
  _id: string;
  id: string;
  amount: number;
  status: TransactionStatus;
  date: Date;
  description?: string;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionQuery {
  status?: TransactionStatus;
  amount_min?: number;
  amount_max?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  sort?: 'date' | '-date' | 'amount' | '-amount';
}

export interface ITransactionCreate {
  id: string;
  amount: number;
  status: TransactionStatus;
  date: Date;
  description?: string;
  currency?: string;
}

export interface ITransactionUpdate {
  amount?: number;
  status?: TransactionStatus;
  date?: Date;
  description?: string;
  currency?: string;
}

export interface IPaginatedTransactions {
  data: ITransactionResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
