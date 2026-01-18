import { PDFComponentPool } from './pdf-component-pool';
import { PDFLayoutList } from './pdf-layout-list';

export abstract class PDFLayoutListPool extends PDFLayoutList {
  protected abstract get poolComponent(): PDFComponentPool;

  public async generate() {
    await this.generatePools();
  }

  protected async generatePools() {
    await this.poolComponent.draw();
  }
}
