import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class OrgListQueryDto {
  @ApiPropertyOptional({ description: 'Search in name/slug/subdomain' })
  @IsOptional() @IsString()
  q?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit: number = 20;

  @ApiPropertyOptional({ example: 'name:asc' })
  @IsOptional() @IsString()
  sort?: string;
}
