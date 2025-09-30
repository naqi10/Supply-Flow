import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    const org = this.orgRepo.create(dto);
    return this.orgRepo.save(org);
  }

  async findAll(): Promise<Organization[]> {
    return this.orgRepo.find();
  }

  async findOne(id: number): Promise<Organization> {
    const org = await this.orgRepo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: number, dto: UpdateOrganizationDto): Promise<Organization> {
    const org = await this.findOne(id);
    Object.assign(org, dto);
    return this.orgRepo.save(org);
  }

  async remove(id: number): Promise<{ message: string }> {
    const org = await this.findOne(id);
    await this.orgRepo.remove(org);
    return { message: 'Organization removed successfully' };
  }
}
