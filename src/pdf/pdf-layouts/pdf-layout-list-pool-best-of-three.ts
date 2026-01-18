import { PDFLayoutListPool } from './pdf-layout-list-pool';
import { Systems } from '../../types/systems.enum';
import { PDFComponentPoolBestOfThree } from './pdf-component-pool-best-of-three';
import { PDFComponentPool } from './pdf-component-pool';

export abstract class PDFLayoutListPoolBestOfThree extends PDFLayoutListPool {
  protected getListSystem(): Systems {
    return Systems.BestOfThree;
  }

  protected get totalPages(): number {
    return 1;
  }

  protected get poolComponent(): PDFComponentPool {
    return new PDFComponentPoolBestOfThree(
      this.doc,
      this.competitions,
      this.listInfo,
    );
  }
}
