import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClassroomsService } from './classrooms.service';
import { ClassroomMember } from './entities/classroom-member.entity';
import { Classroom } from './entities/classroom.entity';

describe('ClassroomsService', () => {
  let service: ClassroomsService;
  let classroomRepository: {
    findOne: jest.Mock;
  };
  let classroomMemberRepository: {
    findOne: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassroomsService,
        {
          provide: getRepositoryToken(Classroom),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ClassroomMember),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClassroomsService>(ClassroomsService);
    classroomRepository = module.get(getRepositoryToken(Classroom));
    classroomMemberRepository = module.get(
      getRepositoryToken(ClassroomMember),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a classroom by id', async () => {
    const classroom = {
      id: 'classroom-id',
      name: 'Turma 1A',
      code: 'TURMA-ABC123',
      schoolYear: '2026',
      teacherId: 10,
    };

    classroomRepository.findOne.mockResolvedValue(classroom);

    await expect(service.findOne('classroom-id')).resolves.toEqual(classroom);
    expect(classroomRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: 'classroom-id',
      },
    });
  });

  it('should reject when finding an unknown classroom', async () => {
    classroomRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('unknown-classroom')).rejects.toThrow(
      'Turma nao encontrada.',
    );
  });

  it('should remove a teacher from a classroom', async () => {
    const member = {
      id: 'member-id',
      classroomId: 'classroom-id',
      userId: 10,
      role: 'Professor',
    };

    classroomRepository.findOne.mockResolvedValue({ id: 'classroom-id' });
    classroomMemberRepository.findOne.mockResolvedValue(member);

    await service.removeTeacher('classroom-id', { userId: 10 });

    expect(classroomMemberRepository.findOne).toHaveBeenCalledWith({
      where: {
        classroomId: 'classroom-id',
        userId: 10,
        role: 'Professor',
      },
    });
    expect(classroomMemberRepository.remove).toHaveBeenCalledWith(member);
  });

  it('should remove a student from a classroom', async () => {
    const member = {
      id: 'member-id',
      classroomId: 'classroom-id',
      userId: 25,
      role: 'Aluno',
    };

    classroomRepository.findOne.mockResolvedValue({ id: 'classroom-id' });
    classroomMemberRepository.findOne.mockResolvedValue(member);

    await service.removeStudent('classroom-id', { userId: 25 });

    expect(classroomMemberRepository.findOne).toHaveBeenCalledWith({
      where: {
        classroomId: 'classroom-id',
        userId: 25,
        role: 'Aluno',
      },
    });
    expect(classroomMemberRepository.remove).toHaveBeenCalledWith(member);
  });

  it('should reject removal when the classroom does not exist', async () => {
    classroomRepository.findOne.mockResolvedValue(null);

    await expect(
      service.removeTeacher('unknown-classroom', { userId: 10 }),
    ).rejects.toThrow('Turma nao encontrada.');

    expect(classroomMemberRepository.findOne).not.toHaveBeenCalled();
    expect(classroomMemberRepository.remove).not.toHaveBeenCalled();
  });

  it('should reject removal when the member does not exist', async () => {
    classroomRepository.findOne.mockResolvedValue({ id: 'classroom-id' });
    classroomMemberRepository.findOne.mockResolvedValue(null);

    await expect(
      service.removeStudent('classroom-id', { userId: 25 }),
    ).rejects.toThrow('Aluno nao encontrado nesta turma.');

    expect(classroomMemberRepository.remove).not.toHaveBeenCalled();
  });
});
