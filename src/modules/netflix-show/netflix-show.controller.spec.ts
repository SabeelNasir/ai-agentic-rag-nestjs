import { Test, TestingModule } from '@nestjs/testing';
import { NetflixShowController } from './netflix-show.controller';

describe('NetflixShowController', () => {
  let controller: NetflixShowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetflixShowController],
    }).compile();

    controller = module.get<NetflixShowController>(NetflixShowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
