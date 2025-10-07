import { SetMetadata } from '@nestjs/common';
import { OrgRole } from '../enums/org-role.enum';

export const ORG_ROLES_KEY = 'orgRoles';
export const OrgRoles = (...roles: OrgRole[]) => SetMetadata(ORG_ROLES_KEY, roles);
