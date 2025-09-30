import { ApiProperty } from '@nestjs/swagger';

export class DashboardMetricsDto {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  activeProducts: number;
}
