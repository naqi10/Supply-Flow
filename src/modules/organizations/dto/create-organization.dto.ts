import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Manufacturing' })
  @IsString()
  @Length(2, 120)
  name: string;

  @ApiPropertyOptional({ example: 'acme' })
  @IsOptional()
  @Matches(/^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/, {
    message: 'subdomain must be lowercase letters/numbers/hyphens (3–63 chars)',
  })
  subdomain?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @Length(2, 140)
  legalName?: string;

  @ApiPropertyOptional() @IsOptional() @IsEmail()
  billingEmail?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'Asia/Karachi' })
  @IsOptional() @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional() @IsString()
  locale?: string;
}
