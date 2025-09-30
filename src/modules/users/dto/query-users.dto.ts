import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUsersDto {
  @ApiPropertyOptional()
  search?: string;

  @ApiPropertyOptional({ default: 0 })
  skip?: number;

  @ApiPropertyOptional({ default: 10 })
  take?: number;
}
