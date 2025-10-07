import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  Unique, Index
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('organizations')
@Unique(['slug'])
@Unique(['subdomain'])
export class Organization {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Index()
  @Column({ length: 120 })
  name: string;

  @ApiProperty({ description: 'URL-safe name; generated from name' })
  @Index()
  @Column({ length: 140 })
  slug: string;

  @ApiProperty({ required: false, description: 'e.g. acme => acme.yourapp.com' })
  @Index()
  @Column({ length: 63, nullable: true })
  subdomain?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  legalName?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  billingEmail?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  logoUrl?: string;

  @ApiProperty({ default: true })
  @Index()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ required: false })
  @Column({ default: 'UTC' })
  timezone: string;

  @ApiProperty({ required: false })
  @Column({ default: 'en' })
  locale: string;

  @Column('uuid', { nullable: true })
  createdByUserId?: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt?: Date;
}
