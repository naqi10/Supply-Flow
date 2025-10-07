import {
  ConflictException, Injectable, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, Not} from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrgListQueryDto } from './dto/org-list-query.dto';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  private async generateUniqueSlug(name: string, excludeId?: string) {
    const base = slugify(name) || 'org';
    let slug = base;
    let i = 1;
    // ensure unique
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await this.orgRepo.findOne({
     where: excludeId ? { slug, id: Not(excludeId) } : { slug },
     withDeleted: true,
    });
      if (!existing) return slug;
      slug = `${base}-${++i}`;
    }
  }

  private async ensureSubdomainFree(subdomain?: string, excludeId?: string) {
    if (!subdomain) return;
    const existing = await this.orgRepo.findOne({
      where: excludeId ? { subdomain } : { subdomain },
      withDeleted: true,
    });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Subdomain is already in use');
    }
  }

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    await this.ensureSubdomainFree(dto.subdomain);
    const slug = await this.generateUniqueSlug(dto.name);
    const org = this.orgRepo.create({ ...dto, slug, isActive: true });
    return this.orgRepo.save(org);
  }

  async findAll(query?: OrgListQueryDto) {
  const { q, page = 1, limit = 20, sort } = query ?? {};
    const qb = this.orgRepo.createQueryBuilder('o');

    if (q) {
      qb.where('o.name ILIKE :q OR o.slug ILIKE :q OR o.subdomain ILIKE :q', { q: `%${q}%` });
    }

    // sorting
    if (sort) {
      const [col, dir = 'asc'] = sort.split(':');
      const allowed = new Set(['name', 'createdAt', 'updatedAt', 'subdomain']);
      qb.orderBy(`o.${allowed.has(col) ? col : 'createdAt'}`, dir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
    } else {
      qb.orderBy('o.createdAt', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async findBySlug(slug: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({ where: { slug } });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    const org = await this.findOne(id);

    if (dto.subdomain && dto.subdomain !== org.subdomain) {
      await this.ensureSubdomainFree(dto.subdomain, id);
    }

    // If name changes, regenerate slug (and keep unique)
    if (dto.name && dto.name !== org.name) {
      org.slug = await this.generateUniqueSlug(dto.name, id);
    }

    Object.assign(org, dto);
    return this.orgRepo.save(org);
  }

  async remove(id: string): Promise<{ message: string }> {
    const org = await this.findOne(id);
    await this.orgRepo.softRemove(org);
    return { message: 'Organization archived (soft-deleted)' };
  }

  async restore(id: string): Promise<Organization> {
    await this.orgRepo.restore(id);
    return this.findOne(id);
  }
}
