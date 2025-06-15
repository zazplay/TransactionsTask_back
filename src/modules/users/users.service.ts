import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../../schemas/user.schema';
import { IUser, IUserResponse } from '../../interfaces/user.interface';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(registerDto: RegisterDto): Promise<IUserResponse> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const createdUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await createdUser.save();
    return this.toUserResponse(savedUser);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login }).exec();
  }

  async findById(id: string): Promise<IUserResponse | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.toUserResponse(user) : null;
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private toUserResponse(user: UserDocument): IUserResponse {
    return {
      _id: (user._id as any).toString(),
      email: user.email,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
