import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export type ClassroomMemberRole = 'Professor' | 'Aluno';

@Entity('classroom_members')
@Unique(['classroomId', 'userId'])
export class ClassroomMember {
  @ApiProperty({
    description: 'Identificador unico do vinculo.',
    example: 'cbbf6c30-3e19-4ff7-b20d-9321423bf80f',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Identificador da turma.',
    example: '2f2491f6-0728-4c26-89a6-da9654bc646d',
    format: 'uuid',
  })
  @Column()
  classroomId!: string;

  @ApiProperty({
    description: 'Identificador numerico do usuario.',
    example: 10,
  })
  @Column()
  userId!: number;

  @ApiProperty({
    description: 'Papel do usuario dentro da turma.',
    enum: ['Professor', 'Aluno'],
    example: 'Professor',
  })
  @Column()
  role!: ClassroomMemberRole;

  @ApiProperty({
    description: 'Data de criacao do vinculo.',
    example: '2026-07-26T12:00:00.000Z',
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt!: Date;
}
