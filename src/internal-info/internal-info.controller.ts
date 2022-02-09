import { Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InternalInfoService } from './internal-info.service';

@Controller('api/v1/internal-info')
@UsePipes(new ValidationPipe({ transform: true }))
export class InternalInfoController {
  constructor(private readonly internalInfoService: InternalInfoService) {}

  @Post('/auto-inactive')
  autoInactive() {
    return this.internalInfoService.autoInactive();
  }
}
