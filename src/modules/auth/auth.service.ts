import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { IAuthResponse, IUserResponse, IJwtPayload } from '../../interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IAuthResponse> {
    const existingUserByEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingUserByEmail) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const existingUserByLogin = await this.usersService.findByLogin(registerDto.login);
    if (existingUserByLogin) {
      throw new ConflictException('Пользователь с таким логином уже существует');
    }

    const user = await this.usersService.create(registerDto);
    const payload: IJwtPayload = { 
      sub: user._id, 
      email: user.email, 
      login: user.login 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async login(user: IUserResponse): Promise<IAuthResponse> {
    const payload: IJwtPayload = { 
      sub: user._id, 
      email: user.email, 
      login: user.login 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUser(email: string, password: string): Promise<IUserResponse | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.validatePassword(password, user.password)) {
      return {
        _id: (user._id as any).toString(),
        email: user.email,
        login: user.login,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
    return null;
  }
}
