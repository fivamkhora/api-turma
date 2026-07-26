import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddClassroomMemberDto {
  @ApiProperty({
    description: 'Identificador numerico do usuario.',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
