import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IAuthResponse, IUserResponse } from '../../interfaces/user.interface';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ 
    status: 201, 
    description: 'Пользователь успешно зарегистрирован',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            login: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
  async register(@Body() registerDto: RegisterDto): Promise<IAuthResponse> {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ 
    status: 200, 
    description: 'Успешный вход',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            login: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Request() req, @Body() loginDto: LoginDto): Promise<IAuthResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение профиля текущего пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Профиль пользователя',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        email: { type: 'string' },
        login: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  getProfile(@Request() req): IUserResponse {
    return req.user;
  }
}
