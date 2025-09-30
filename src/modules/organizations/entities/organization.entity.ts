import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  address?: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  contactEmail?: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  contactPhone?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
