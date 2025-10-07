import {
  Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MembershipsService } from './memberships.service';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { MemberListQueryDto } from './dto/member-list-query.dto';
import { Membership } from './entities/membership.entity';
import { OrgMembershipGuard } from './guards/org-membership.guard';
import { OrgRoles } from './decorators/org-roles.decorator';
import { OrgRole } from './enums/org-role.enum';

@ApiTags('memberships')
@ApiBearerAuth()
@Controller('organizations/:orgId/members')
@UseGuards(AuthGuard('jwt'), OrgMembershipGuard) // must be logged in + a member
export class MembershipsController {
  constructor(private readonly svc: MembershipsService) {}

  @Post()
  @OrgRoles(OrgRole.ADMIN, OrgRole.OWNER) // only ADMIN/OWNER (owners included automatically)
  @ApiOperation({ summary: 'Add member to organization' })
  @ApiResponse({ status: 201, type: Membership })
  add(
    @Param('orgId', new ParseUUIDPipe()) orgId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.svc.addMember(orgId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List organization members (paginated)' })
  list(
    @Param('orgId', new ParseUUIDPipe()) orgId: string,
    @Query() q: MemberListQueryDto,
  ) {
    return this.svc.listMembers(orgId, q);
  }

  @Patch(':memberId/role')
  @OrgRoles(OrgRole.ADMIN, OrgRole.OWNER) // only ADMIN/OWNER
  @ApiOperation({ summary: 'Update member role' })
  updateRole(
    @Param('orgId', new ParseUUIDPipe()) orgId: string,
    @Param('memberId', new ParseUUIDPipe()) memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.svc.updateRole(orgId, memberId, dto);
  }

  @Delete(':memberId')
  @OrgRoles(OrgRole.ADMIN, OrgRole.OWNER) // only ADMIN/OWNER
  @ApiOperation({ summary: 'Remove member (soft-delete)' })
  remove(
    @Param('orgId', new ParseUUIDPipe()) orgId: string,
    @Param('memberId', new ParseUUIDPipe()) memberId: string,
  ) {
    return this.svc.remove(orgId, memberId);
  }
}
