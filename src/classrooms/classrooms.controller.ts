import { Body, Controller, Get, Post } from '@nestjs/common';

import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Controller('classrooms')
export class ClassroomsController {
  constructor(
    private readonly classroomsService: ClassroomsService,
  ) {}

  @Post()
  async create(
    @Body() createClassroomDto: CreateClassroomDto,
  ) {
    return this.classroomsService.create(createClassroomDto);
  }

  @Get()
  async findAll() {
    return this.classroomsService.findAll();
  }
}