import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty({
    description: 'Nome da turma.',
    example: 'Turma 1A',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Ano letivo da turma.',
    example: '2026',
  })
  @IsString()
  @IsNotEmpty()
  schoolYear!: string;
}
