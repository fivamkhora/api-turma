import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { AddClassroomMemberDto } from './dto/add-classroom-member.dto';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  async create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomsService.create(createClassroomDto);
  }

  @Get()
  async findAll() {
    return this.classroomsService.findAll();
  }

  @Post(':id/teachers')
  async addTeacher(
    @Param('id') classroomId: string,
    @Body() addClassroomMemberDto: AddClassroomMemberDto,
  ) {
    return this.classroomsService.addTeacher(
      classroomId,
      addClassroomMemberDto,
    );
  }

  @Post(':id/students')
  async addStudent(
    @Param('id') classroomId: string,
    @Body() addClassroomMemberDto: AddClassroomMemberDto,
  ) {
    return this.classroomsService.addStudent(
      classroomId,
      addClassroomMemberDto,
    );
  }
}