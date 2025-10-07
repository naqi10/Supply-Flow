import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { UserRole } from '../users/entities/user.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { OrgListQueryDto } from '../organizations/dto/org-list-query.dto';

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly orgService: OrganizationsService,
    private readonly dashboardService: DashboardService,
  ) {}

  // Organization Management
  getAllOrganizations(query?: OrgListQueryDto) {
    return this.orgService.findAll(query); // query is optional now
  }

  deleteOrganization(id: string) {         // <-- UUID string
    return this.orgService.remove(id);
  }

  // User Management
  getAllUsers() {
    return this.usersService.findAll();
  }

  // keep number here only if your users table still uses numeric IDs.
  // if you've migrated users to UUIDs, change 'number' to 'string'
  updateUserRole(id: number, role: UserRole) {
    const dto: UpdateUserDto = { role } as UpdateUserDto;
    return this.usersService.update(id, dto);
  }

  // Dashboard Access
  getDashboardOverview() {
    return this.dashboardService.getOverview();
  }
}
