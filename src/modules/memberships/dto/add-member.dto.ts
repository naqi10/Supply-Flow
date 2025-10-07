import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OrgRole } from '../enums/org-role.enum';

export class AddMemberDto {
  @ApiProperty({ description: 'User primary key (number or uuid as string)' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: OrgRole, default: OrgRole.VIEWER })
  @IsEnum(OrgRole)
  role: OrgRole = OrgRole.VIEWER;
}
