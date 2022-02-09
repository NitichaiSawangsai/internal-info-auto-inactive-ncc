import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Brackets, Repository } from 'typeorm';
import { InternalInfo } from './internal-info.entity';
import { InternalInfoStatusType } from './internal-info.enum';

@Injectable()
export class InternalInfoService {
  constructor(
    @InjectRepository(InternalInfo)
    private readonly internalInfoRepository: Repository<InternalInfo>,
  ) {}

  autoInactive() {
    const queryBuilder = this.internalInfoRepository
      .createQueryBuilder('internal')
      .where('internal.changeInactive = :changeInactive', {
        changeInactive: false,
      })
      .andWhere('internal.status = :status', {
        status: InternalInfoStatusType.Active,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere(
            new Brackets((qb) => {
              qb.where('internal.expireDate IS NULL');
              qb.andWhere('internal.createdAt > :date', {
                date: moment().add(1, 'M').toDate(),
              });
            }),
          );
          qb.orWhere(
            new Brackets((qb) => {
              qb.where('internal.expireDate IS NOT NULL');
              qb.andWhere('internal.expireDate < :date', {
                date: moment().toDate(),
              });
            }),
          );
        }),
      );

    return queryBuilder
      .select([
        'internal.id',
        'internal.title',
        'internal.expireDate',
        'internal.changeInactive',
        'internal.status',
        'internal.createdAt',
      ])
      .getMany();
  }
}
