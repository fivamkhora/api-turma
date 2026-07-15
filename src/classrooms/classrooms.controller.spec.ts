import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';

describe('ClassroomsController', () => {
  let controller: ClassroomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomsController],
      providers: [
        {
          provide: ClassroomsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUserId: jest.fn(),
            findMembersByClassroomId: jest.fn(),
            addTeacher: jest.fn(),
            addStudent: jest.fn(),
            removeTeacher: jest.fn(),
            removeStudent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClassroomsController>(ClassroomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
