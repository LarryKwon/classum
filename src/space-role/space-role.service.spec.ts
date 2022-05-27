import { Test, TestingModule } from '@nestjs/testing';
import { SpaceRoleService } from './space-role.service';

describe('SpaceRoleService', () => {
  let service: SpaceRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceRoleService],
    }).compile();

    service = module.get<SpaceRoleService>(SpaceRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
