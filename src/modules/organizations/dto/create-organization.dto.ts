import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'TechCorp Ltd.' })
  name: string;

  @ApiProperty({ example: '123 Main St, New York', required: false })
  address?: string;

  @ApiProperty({ example: 'info@techcorp.com', required: false })
  contactEmail?: string;

  @ApiProperty({ example: '+1-202-555-0187', required: false })
  contactPhone?: string;
}
