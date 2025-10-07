import {
  Entity, PrimaryGeneratedColumn, Column, Unique, Index,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrgRole } from '../enums/org-role.enum';

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED',
  SUSPENDED = 'SUSPENDED',
}

@Entity('memberships')
@Unique(['userId', 'organizationId'])
export class Membership {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Keep flexible: works with numeric or uuid user PKs
  @ApiProperty()
  @Index()
  @Column({ type: 'varchar', length: 64 })
  userId: string;

  @ApiProperty({ format: 'uuid' })
  @Index()
  @Column('uuid')
  organizationId: string;

  @ApiProperty({ enum: OrgRole, default: OrgRole.VIEWER })
  @Column({ type: 'enum', enum: OrgRole, default: OrgRole.VIEWER })
  role: OrgRole;

  @ApiProperty({ enum: MembershipStatus, default: MembershipStatus.ACTIVE })
  @Index()
  @Column({ type: 'enum', enum: MembershipStatus, default: MembershipStatus.ACTIVE })
  status: MembershipStatus;

  @Column({ type: 'varchar', length: 64, nullable: true })
  createdByUserId?: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt?: Date;
}
