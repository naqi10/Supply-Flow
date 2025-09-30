import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { UserRole } from '../users/entities/user.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly orgService: OrganizationsService,
    private readonly dashboardService: DashboardService,
  ) {}

  // Organization Management
  getAllOrganizations() {
    return this.orgService.findAll();
  }

  deleteOrganization(id: number) {
    return this.orgService.remove(id);
  }

  // User Management
  getAllUsers() {
    return this.usersService.findAll();
  }

  updateUserRole(id: number, role: UserRole) {
    const dto: UpdateUserDto = { role } as UpdateUserDto;
    return this.usersService.update(id, dto);
  }

  // Dashboard Access
  getDashboardOverview() {
    return this.dashboardService.getOverview();
  }
}
