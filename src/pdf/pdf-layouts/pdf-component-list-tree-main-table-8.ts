import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';

export class PDFComponentListTreeMainTable8 extends PDFComponentListTreeMainTable {
  async draw(): Promise<void> {
    await this.doc.addPageAsync();

    await this.row1(this.competitions.slice(-7, -3));
    await this.row2(this.competitions.slice(-3, -1));
    await this.row3(this.competitions.slice(-1));
  }
}
