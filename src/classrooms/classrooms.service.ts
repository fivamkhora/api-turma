import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Classroom } from './entities/classroom.entity';
import { ClassroomMember, ClassroomMemberRole } from './entities/classroom-member.entity';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { AddClassroomMemberDto } from './dto/add-classroom-member.dto';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,

    @InjectRepository(ClassroomMember)
    private readonly classroomMemberRepository: Repository<ClassroomMember>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const code = this.generateClassroomCode();

    const classroom = this.classroomRepository.create({
      ...createClassroomDto,
      code,
    });

    return await this.classroomRepository.save(classroom);
  }

  async findAll() {
    return await this.classroomRepository.find();
  }

  async addTeacher(
    classroomId: string,
    addClassroomMemberDto: AddClassroomMemberDto,
  ) {
    return this.addMember(
      classroomId,
      addClassroomMemberDto.userId,
      'Professor',
    );
  }

  async addStudent(
    classroomId: string,
    addClassroomMemberDto: AddClassroomMemberDto,
  ) {
    return this.addMember(
      classroomId,
      addClassroomMemberDto.userId,
      'Aluno',
    );
  }

  private async addMember(
    classroomId: string,
    userId: number,
    role: ClassroomMemberRole,
  ) {
    const classroom = await this.classroomRepository.findOne({
      where: {
        id: classroomId,
      },
    });

    if (!classroom) {
      throw new NotFoundException('Turma não encontrada.');
    }

    const alreadyExists = await this.classroomMemberRepository.findOne({
      where: {
        classroomId,
        userId,
      },
    });

    if (alreadyExists) {
      throw new ConflictException('Usuário já está vinculado a esta turma.');
    }

    const member = this.classroomMemberRepository.create({
      classroomId,
      userId,
      role,
    });

    return await this.classroomMemberRepository.save(member);
  }

  private generateClassroomCode(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `TURMA-${random}`;
  }
}