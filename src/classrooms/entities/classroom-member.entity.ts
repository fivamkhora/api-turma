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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  classroomId!: string;

  @Column()
  userId!: number;

  @Column()
  role!: ClassroomMemberRole;

  @CreateDateColumn()
  createdAt!: Date;
}