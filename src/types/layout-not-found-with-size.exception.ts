import { BadRequestException } from '@nestjs/common';

export class LayoutNotFoundWithSize extends BadRequestException {
  constructor(size: number) {
    super('Layout not found with athlete size: ' + size);
  }
}
