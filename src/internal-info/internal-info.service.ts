import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalInfo } from './internal-info.entity';

@Injectable()
export class InternalInfoService {
  constructor(
    @InjectRepository(InternalInfo)
    private readonly internalInfoRepository: Repository<InternalInfo>,
  ) {}

  autoInactive() {
    return 122;
  }
}
