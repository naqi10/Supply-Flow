import {
  BadRequestException, CanActivate, ExecutionContext, ForbiddenException,
  Injectable, UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrgRole } from '../enums/org-role.enum';
import { MembershipsService } from '../memberships.service';
import { ORG_ROLES_KEY } from '../decorators/org-roles.decorator';

const RANK: Record<OrgRole, number> = {
  [OrgRole.VIEWER]: 0,
  [OrgRole.STAFF]: 1,
  [OrgRole.MANAGER]: 2,
  [OrgRole.ADMIN]: 3,
  [OrgRole.OWNER]: 4,
};

@Injectable()
export class OrgMembershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly memberships: MembershipsService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    // 1) must be authenticated (JWT should have set req.user)
    const user = req.user;
    if (!user?.id) throw new UnauthorizedException('Login required');

    // 2) resolve orgId from route param or header
    const orgId =
      req.params?.orgId ||
      (req.headers['x-org-id'] as string) ||
      null;

    if (!orgId) {
      throw new BadRequestException('orgId is required (param or x-org-id header)');
    }

    // 3) get membership
    const membership = await this.memberships.findByUserAndOrg(String(user.id), orgId);
    if (!membership) {
      throw new ForbiddenException('Not a member of this organization');
    }

    // 4) check role if route declares requirements
    const required: OrgRole[] =
      this.reflector.getAllAndOverride<OrgRole[]>(ORG_ROLES_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) || [];

    if (required.length === 0) {
      // membership alone is enough
      req.membership = membership;
      return true;
    }

    // allow if member's rank >= the minimum required rank
    const minRequired = Math.min(...required.map(r => RANK[r]));
    if (RANK[membership.role] >= minRequired) {
      req.membership = membership;
      return true;
    }

    throw new ForbiddenException('Insufficient role for this operation');
  }
}
