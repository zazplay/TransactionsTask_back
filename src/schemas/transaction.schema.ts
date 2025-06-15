import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document & {
  createdAt: Date;
  updatedAt: Date;
};

export enum TransactionStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
  FAILED = 'failed',
}

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, type: Number, index: true })
  amount: number;

  @Prop({ 
    required: true, 
    enum: TransactionStatus,
    index: true,
  })
  status: TransactionStatus;

  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  currency?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.index({ status: 1, amount: 1 });
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ amount: 1 });
TransactionSchema.index({ id: 1 }, { unique: true });
