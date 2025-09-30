import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    if (email === 'test@mail.com' && password === 'password123') {
      return { id: 1, email, role: 'user' };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: { id: number; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'supersecretkey',
      });
      return this.login({ id: decoded.sub, email: decoded.email, role: decoded.role });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
