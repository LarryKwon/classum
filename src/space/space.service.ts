import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRepository } from './repository/space.repository';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(SpaceRepository)
    private readonly spaceRepository: SpaceRepository,
  ) {}
}
