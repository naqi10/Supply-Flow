import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { UsersModule } from './modules/users/users.module';
// import { PreciseModule } from './modules/users/precise/precise.module';

import { MembershipsModule } from './modules/memberships/memberships.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'supplyflow',
      autoLoadEntities: true,
      synchronize: true,
    }),
    // UsersModule,
    UsersModule,
    AuthModule,
    DashboardModule,
    OrganizationsModule,
    SuperAdminModule,
    MembershipsModule,

    // PreciseModule,
  ],
})
export class AppModule { }
