import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Classroom } from './entities/classroom.entity';
import {
  ClassroomMember,
  ClassroomMemberRole,
} from './entities/classroom-member.entity';
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

  async findByUserId(userId: number) {
    const members = await this.classroomMemberRepository.find({
      where: {
        userId,
      },
    });

    const classroomIds = members.map((member) => member.classroomId);

    if (classroomIds.length === 0) {
      return [];
    }

    return await this.classroomRepository.find({
      where: {
        id: In(classroomIds),
      },
    });
  }

  async findOne(classroomId: string) {
    const classroom = await this.classroomRepository.findOne({
      where: {
        id: classroomId,
      },
    });

    if (!classroom) {
      throw new NotFoundException('Turma nao encontrada.');
    }

    return classroom;
  }

  async findMembersByClassroomId(classroomId: string) {
    await this.findOne(classroomId);

    return await this.classroomMemberRepository.find({
      where: {
        classroomId,
      },
    });
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

  async removeTeacher(
    classroomId: string,
    removeClassroomMemberDto: AddClassroomMemberDto,
  ) {
    await this.removeMember(
      classroomId,
      removeClassroomMemberDto.userId,
      'Professor',
    );
  }

  async removeStudent(
    classroomId: string,
    removeClassroomMemberDto: AddClassroomMemberDto,
  ) {
    await this.removeMember(
      classroomId,
      removeClassroomMemberDto.userId,
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

  private async removeMember(
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
      throw new NotFoundException('Turma nao encontrada.');
    }

    const member = await this.classroomMemberRepository.findOne({
      where: {
        classroomId,
        userId,
        role,
      },
    });

    if (!member) {
      throw new NotFoundException(
        `${role} nao encontrado nesta turma.`,
      );
    }

    await this.classroomMemberRepository.remove(member);
  }

  private generateClassroomCode(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `TURMA-${random}`;
  }
}
