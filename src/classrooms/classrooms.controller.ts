import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

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

  @Get(':id/members')
  async findClassroomsByUser(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.classroomsService.findByUserId(userId);
  }

  @Get(':id')
  async findMembersByClassroom(
    @Param('id') classroomId: string,
  ) {
    return this.classroomsService.findMembersByClassroomId(classroomId);
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

  @Delete(':id/teachers')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTeacher(
    @Param('id') classroomId: string,
    @Body() removeClassroomMemberDto: AddClassroomMemberDto,
  ) {
    await this.classroomsService.removeTeacher(
      classroomId,
      removeClassroomMemberDto,
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

  @Delete(':id/students')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeStudent(
    @Param('id') classroomId: string,
    @Body() removeClassroomMemberDto: AddClassroomMemberDto,
  ) {
    await this.classroomsService.removeStudent(
      classroomId,
      removeClassroomMemberDto,
    );
  }
}
