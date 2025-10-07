import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { OrgMembershipGuard } from './guards/org-membership.guard';


@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  controllers: [MembershipsController],
  providers: [MembershipsService, OrgMembershipGuard],
  exports: [MembershipsService, OrgMembershipGuard],
})
export class MembershipsModule {}
