import { Module } from '@nestjs/common';
import { InternalInfoService } from './internal-info.service';
import { InternalInfoController } from './internal-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalInfo } from './internal-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InternalInfo])],
  providers: [InternalInfoService],
  controllers: [InternalInfoController],
})
export class InternalInfoModule {}
