import { PDFLayoutListPool } from './pdf-layout-list-pool';
import { Systems } from '../../types/systems.enum';
import { PDFComponentPoolSingle } from './pdf-component-pool-single-pool';
import { PDFComponentPool } from './pdf-component-pool';

export abstract class PDFLayoutListPoolDeathMatch extends PDFLayoutListPool {
  protected getListSystem(): Systems {
    return Systems.JederGegenJeden;
  }

  protected get totalPages(): number {
    return 1;
  }

  protected get poolComponent(): PDFComponentPool {
    return new PDFComponentPoolSingle(
      this.doc,
      this.competitions,
      this.listInfo,
    );
  }
}
