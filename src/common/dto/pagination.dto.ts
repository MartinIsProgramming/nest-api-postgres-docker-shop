import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'How many rows do you need',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'Amount of rows you want to skip',
    required: false,
  })
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
