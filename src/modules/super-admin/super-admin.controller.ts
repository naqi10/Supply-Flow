import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuperAdminService } from './super-admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('super-admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly svc: SuperAdminService) {}

  // Manage organizations
  @Get('organizations')
  getAllOrgs() {
    return this.svc.getAllOrganizations();
  }

  @Delete('organizations/:id')
  deleteOrg(@Param('id') id: number) {
    return this.svc.deleteOrganization(id);
  }

  // Manage users
  @Get('users')
  getAllUsers() {
    return this.svc.getAllUsers();
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: number, @Body() body: { role: UserRole }) {
    return this.svc.updateUserRole(id, body.role);
  }

  // Access dashboards
  @Get('dashboard/overview')
  getDashboardOverview() {
    return this.svc.getDashboardOverview();
  }
}
