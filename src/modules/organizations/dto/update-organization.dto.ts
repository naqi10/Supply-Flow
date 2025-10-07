import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { Matches, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiPropertyOptional({ readOnly: true, description: 'Slug is regenerated if name changes' })
  slug?: string;

  @IsOptional()
  @Matches(/^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/)
  subdomain?: string;
}
