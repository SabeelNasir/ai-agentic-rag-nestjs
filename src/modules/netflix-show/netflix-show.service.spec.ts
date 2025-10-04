import { Test, TestingModule } from '@nestjs/testing';
import { NetflixShowService } from './netflix-show.service';

describe('NetflixShowService', () => {
  let service: NetflixShowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetflixShowService],
    }).compile();

    service = module.get<NetflixShowService>(NetflixShowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
