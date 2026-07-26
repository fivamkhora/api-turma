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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ClassroomsService } from './classrooms.service';
import { AddClassroomMemberDto } from './dto/add-classroom-member.dto';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { ClassroomMember } from './entities/classroom-member.entity';
import { Classroom } from './entities/classroom.entity';

@ApiTags('Turmas')
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @ApiOperation({
    summary: 'Criar uma turma',
    description:
      'Cria uma turma sem membros e gera automaticamente um codigo no formato TURMA-XXXXXX.',
  })
  @ApiCreatedResponse({
    description: 'Turma criada com sucesso.',
    type: Classroom,
  })
  @ApiBadRequestResponse({
    description: 'Nome ou ano letivo ausente ou invalido.',
  })
  @Post()
  async create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomsService.create(createClassroomDto);
  }

  @ApiOperation({ summary: 'Listar todas as turmas' })
  @ApiOkResponse({
    description: 'Lista de turmas. Retorna uma lista vazia quando nao ha dados.',
    type: Classroom,
    isArray: true,
  })
  @Get()
  async findAll() {
    return this.classroomsService.findAll();
  }

  @ApiOperation({ summary: 'Listar turmas vinculadas a um usuario' })
  @ApiParam({
    name: 'id',
    description: 'Identificador numerico do usuario (userId).',
    example: 10,
    type: Number,
  })
  @ApiOkResponse({
    description:
      'Turmas nas quais o usuario esta vinculado. Retorna uma lista vazia quando nao ha vinculos.',
    type: Classroom,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'O id do usuario nao e numerico.' })
  @Get(':id/members')
  async findClassroomsByUser(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.classroomsService.findByUserId(userId);
  }

  @ApiOperation({ summary: 'Listar membros de uma turma' })
  @ApiParam({
    name: 'id',
    description: 'UUID da turma.',
    example: '2f2491f6-0728-4c26-89a6-da9654bc646d',
    format: 'uuid',
    type: String,
  })
  @ApiOkResponse({
    description:
      'Professores e alunos vinculados. Retorna uma lista vazia quando a turma nao possui membros.',
    type: ClassroomMember,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Turma nao encontrada.' })
  @Get(':id/classrooms')
  async findMembersByClassroom(@Param('id') classroomId: string) {
    return this.classroomsService.findMembersByClassroomId(classroomId);
  }

  @ApiOperation({ summary: 'Buscar uma turma pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID da turma.',
    example: '2f2491f6-0728-4c26-89a6-da9654bc646d',
    format: 'uuid',
    type: String,
  })
  @ApiOkResponse({
    description: 'Turma encontrada.',
    type: Classroom,
  })
  @ApiNotFoundResponse({ description: 'Turma nao encontrada.' })
  @Get(':id')
  async findOne(@Param('id') classroomId: string) {
    return this.classroomsService.findOne(classroomId);
  }

  @ApiOperation({ summary: 'Vincular um professor a uma turma' })
  @ApiParam({
    name: 'id',
    description: 'UUID da turma.',
    example: '2f2491f6-0728-4c26-89a6-da9654bc646d',
    format: 'uuid',
    type: String,
  })
  @ApiCreatedResponse({
    description: 'Professor vinculado com sucesso.',
    type: ClassroomMember,
  })
  @ApiBadRequestResponse({ description: 'userId ausente ou invalido.' })
  @ApiNotFoundResponse({ description: 'Turma nao encontrada.' })
  @ApiConflictResponse({
    description: 'Usuario ja vinculado a esta turma.',
  })
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

  @ApiOperation({ summary: 'Remover um professor de uma turma' })
  @ApiParam({
    name: 'id',
    description: 'UUID da turma.',
    example: '2f2491f6-0728-4c26-89a6-da9654bc646d',
    format: 'uuid',
    type: String,
  })
  @ApiNoContentResponse({ description: 'Professor removido com sucesso.' })
  @ApiBadRequestResponse({ description: 'userId ausente ou invalido.' })
  @ApiNotFoundResponse({
    description: 'Turma ou professor nao encontrado.',
  })
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

  @ApiOperation({ summary: 'Vincular um aluno a uma turma' })
  @ApiParam({
    name: 'id',
    description: 'UUID da turma.',
    example: '2f2491f6-0728-4c26-89a6-da9654bc646d',
    format: 'uuid',
    type: String,
  })
  @ApiCreatedResponse({
    description: 'Aluno vinculado com sucesso.',
    type: ClassroomMember,
  })
  @ApiBadRequestResponse({ description: 'userId ausente ou invalido.' })
  @ApiNotFoundResponse({ description: 'Turma nao encontrada.' })
  @ApiConflictResponse({
    description: 'Usuario ja vinculado a esta turma.',
  })
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

  @ApiOperation({ summary: 'Remover um aluno de uma turma' })
  @ApiParam({
    name: 'id',
    description: 'UUID da turma.',
    example: '2f2491f6-0728-4c26-89a6-da9654bc646d',
    format: 'uuid',
    type: String,
  })
  @ApiNoContentResponse({ description: 'Aluno removido com sucesso.' })
  @ApiBadRequestResponse({ description: 'userId ausente ou invalido.' })
  @ApiNotFoundResponse({ description: 'Turma ou aluno nao encontrado.' })
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
