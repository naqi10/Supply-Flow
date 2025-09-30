import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(dto: CreateUserDto, role: UserRole = UserRole.USER): Promise<User> {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already in use');

    const passwordToHash = dto.password ?? Math.random().toString(36).slice(-12);
    const hashed = await bcrypt.hash(passwordToHash, 10);

    const user = this.repo.create({
      email: dto.email,
      name: dto.name,
      password: hashed,
      role,
      organizationId: dto.organizationId,
    });

    return this.repo.save(user);
  }

  async findAll(q?: { search?: string; skip?: number; take?: number }) {
    const where = q?.search ? [{ email: ILike(`%${q.search}%`) }, { name: ILike(`%${q.search}%`) }] : {};
    const [data, total] = await this.repo.findAndCount({
      where: where as any,
      skip: q?.skip,
      take: q?.take,
      order: { createdAt: 'DESC' },
    });
    return { total, data };
  }

  async findOne(id: number): Promise<User> {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const user = await this.findOne(id);
    await this.repo.remove(user);
    return { deleted: true };
  }

  // For AuthService convenience
  async validatePassword(email: string, plain: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(plain, user.password);
    return ok ? user : null;
  }

  // optional helper to set password (used in reset)
  async setPassword(email: string, newPassword: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    user.password = await bcrypt.hash(newPassword, 10);
    return this.repo.save(user);
  }
}
