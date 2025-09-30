import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Signup' })
  @ApiBody({ schema: { example: { email: 'test@mail.com', password: 'password123' } } })
  @ApiResponse({ status: 201, description: 'User created + JWT returned' })
  async signup(@Body() body: { email: string; password: string }) {
    const user = { id: Date.now(), email: body.email, role: 'user' };
    return this.authService.login(user);
  }

  @Post('signin')
  @ApiOperation({ summary: 'User signin' })
  @ApiBody({ schema: { example: { email: 'test@mail.com', password: 'password123' } } })
  @ApiResponse({ status: 200, description: 'JWT returned' })
  async signin(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ schema: { example: { refreshToken: 'xxxx.yyyy.zzzz' } } })
  @ApiResponse({ status: 200, description: 'New JWT returned' })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
