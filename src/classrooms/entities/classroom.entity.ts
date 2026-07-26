import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('classrooms')
export class Classroom {
  @ApiProperty({
    description: 'Identificador unico da turma.',
    example: '2f2491f6-0728-4c26-89a6-da9654bc646d',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Nome da turma.', example: 'Turma 1A' })
  @Column()
  name!: string;

  @ApiProperty({
    description: 'Codigo unico gerado automaticamente.',
    example: 'TURMA-ABC123',
  })
  @Column({
    unique: true,
  })
  code!: string;

  @ApiProperty({ description: 'Ano letivo.', example: '2026' })
  @Column()
  schoolYear!: string;

  @ApiProperty({
    description: 'Data de criacao da turma.',
    example: '2026-07-26T12:00:00.000Z',
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    description: 'Data da ultima atualizacao da turma.',
    example: '2026-07-26T12:00:00.000Z',
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt!: Date;
}
