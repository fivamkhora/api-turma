import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClassroomsService } from './classrooms.service';
import { Classroom } from './entities/classroom.entity';

describe('ClassroomsService', () => {
  let service: ClassroomsService;

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
          },
        },
      ],
    }).compile();

    service = module.get<ClassroomsService>(ClassroomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
