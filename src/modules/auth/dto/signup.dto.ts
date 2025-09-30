import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty({ required: false })
  organizationId?: number;
}
