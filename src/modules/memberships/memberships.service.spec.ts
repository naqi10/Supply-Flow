import {
  ConflictException, Injectable, NotFoundException, BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership, MembershipStatus } from './entities/membership.entity';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { MemberListQueryDto } from './dto/member-list-query.dto';
import { OrgRole } from './enums/org-role.enum';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private readonly memRepo: Repository<Membership>,
  ) {}

  async addMember(orgId: string, dto: AddMemberDto) {
    // unique constraint enforced at DB level too
    const existing = await this.memRepo.findOne({ where: {
      userId: dto.userId, organizationId: orgId,
    }});
    if (existing && !existing.deletedAt) {
      throw new ConflictException('User is already a member of this organization');
    }
    const member = this.memRepo.create({
      organizationId: orgId,
      userId: dto.userId,
      role: dto.role,
      status: MembershipStatus.ACTIVE,
    });
    return this.memRepo.save(member);
  }

  async listMembers(orgId: string, query?: MemberListQueryDto) {
    const { q, page = 1, limit = 20 } = query ?? {};
    const qb = this.memRepo.createQueryBuilder('m')
      .where('m.organizationId = :orgId', { orgId })
      .orderBy('m.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (q) {
      qb.andWhere('(m.userId ILIKE :q OR m.role ILIKE :q OR m.status ILIKE :q)', { q: `%${q}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async getMember(orgId: string, memberId: string) {
    const m = await this.memRepo.findOne({ where: { id: memberId, organizationId: orgId } });
    if (!m) throw new NotFoundException('Member not found in this organization');
    return m;
  }

  async updateRole(orgId: string, memberId: string, dto: UpdateMemberRoleDto) {
    const m = await this.getMember(orgId, memberId);

    // prevent demoting the last OWNER
    if (m.role === OrgRole.OWNER && dto.role !== OrgRole.OWNER) {
      const owners = await this.memRepo.count({ where: { organizationId: orgId, role: OrgRole.OWNER } });
      if (owners <= 1) throw new BadRequestException('Cannot demote the last owner of the organization');
    }

    m.role = dto.role;
    return this.memRepo.save(m);
  }

  async remove(orgId: string, memberId: string) {
    const m = await this.getMember(orgId, memberId);

    // prevent deleting the last OWNER
    if (m.role === OrgRole.OWNER) {
      const owners = await this.memRepo.count({ where: { organizationId: orgId, role: OrgRole.OWNER } });
      if (owners <= 1) throw new BadRequestException('Cannot remove the last owner');
    }

    await this.memRepo.softRemove(m);
    return { message: 'Member removed from organization' };
  }
}
