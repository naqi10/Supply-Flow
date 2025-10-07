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
export class MembershipsService { // <-- exact name used by controller
  constructor(
    @InjectRepository(Membership)
    private readonly memRepo: Repository<Membership>,
  ) {}

  // <-- new method added here
  async findByUserAndOrg(userId: string, orgId: string) {
    return this.memRepo.findOne({
      where: { userId, organizationId: orgId },
    });
  }

  // <-- controller expects this exact method name
  async addMember(orgId: string, dto: AddMemberDto) {
    const existing = await this.memRepo.findOne({
      where: { userId: dto.userId, organizationId: orgId },
      withDeleted: false,
    });
    if (existing) throw new ConflictException('User is already a member of this organization');

    const member = this.memRepo.create({
      organizationId: orgId,
      userId: dto.userId,
      role: dto.role,
      status: MembershipStatus.ACTIVE,
    });
    return this.memRepo.save(member);
  }

  // <-- controller expects this exact method name
  async listMembers(orgId: string, query?: MemberListQueryDto) {
    const { q, page = 1, limit = 20 } = query ?? {};
    const qb = this.memRepo.createQueryBuilder('m')
      .where('m.organizationId = :orgId', { orgId })
      .orderBy('m.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (q) {
      qb.andWhere(
        '(m.userId ILIKE :q OR m.role::text ILIKE :q OR m.status::text ILIKE :q)',
        { q: `%${q}%` }
      );
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  private async getMemberAssert(orgId: string, memberId: string) {
    const m = await this.memRepo.findOne({ where: { id: memberId, organizationId: orgId } });
    if (!m) throw new NotFoundException('Member not found in this organization');
    return m;
  }

  // <-- controller expects this exact method name
  async updateRole(orgId: string, memberId: string, dto: UpdateMemberRoleDto) {
    const m = await this.getMemberAssert(orgId, memberId);

    // prevent demoting the last OWNER
    if (m.role === OrgRole.OWNER && dto.role !== OrgRole.OWNER) {
      const owners = await this.memRepo.count({ where: { organizationId: orgId, role: OrgRole.OWNER } });
      if (owners <= 1) throw new BadRequestException('Cannot demote the last owner of the organization');
    }

    m.role = dto.role;
    return this.memRepo.save(m);
  }

  // <-- controller expects this exact method name
  async remove(orgId: string, memberId: string) {
    const m = await this.getMemberAssert(orgId, memberId);

    // prevent deleting the last OWNER
    if (m.role === OrgRole.OWNER) {
      const owners = await this.memRepo.count({ where: { organizationId: orgId, role: OrgRole.OWNER } });
      if (owners <= 1) throw new BadRequestException('Cannot remove the last owner');
    }

    await this.memRepo.softRemove(m);
    return { message: 'Member removed from organization' };
  }
}
