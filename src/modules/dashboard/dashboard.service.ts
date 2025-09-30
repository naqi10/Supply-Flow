import { Injectable } from '@nestjs/common';
import { DashboardMetricsDto } from './dto/dashboard-metrics.dto';

@Injectable()
export class DashboardService {
  getMetrics(): DashboardMetricsDto {
    return {
      totalUsers: 150,
      totalOrders: 320,
      revenue: 12500,
      activeProducts: 87,
    };
  }

  getRecentActivities(): string[] {
    return [
      'User John created a new order',
      'Product "Laptop" Stock Added',
      'Forecast updated for September',
    ];
  }

  getOverview() {
    return {
      metrics: this.getMetrics(),
      activities: this.getRecentActivities(),
    };
  }
}
