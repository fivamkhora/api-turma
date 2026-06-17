import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Classroom } from './entities/classroom.entity';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
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

  private generateClassroomCode(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `TURMA-${random}`;
  }
}