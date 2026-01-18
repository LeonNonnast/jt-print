import { BadRequestException } from '@nestjs/common';
import { Systems } from './systems.enum';

export class LayoutNotFoundWithSystem extends BadRequestException {
  constructor(system: Systems) {
    super('Layout does not exists with sytem: ' + system);
  }
}
