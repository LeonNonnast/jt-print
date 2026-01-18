import { RoundHeaders } from 'src/types/round-headers.enum';
import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';

export class PDFComponentListTreeMainTable16 extends PDFComponentListTreeMainTable {
  async draw(): Promise<void> {
    await this.doc.addPageAsync();

    await this.row1(this.competitions.slice(0, 8));
    await this.row2(
      this.competitions.slice(8, 12),
      RoundHeaders.QuarterFinals,
      true,
    );
    await this.row3(this.competitions.slice(-3, -1), RoundHeaders.HalfFinals);
    await this.row4(this.competitions.slice(-1), RoundHeaders.Finals);

    await this.drawPoolInfo(
      { x: 190, y: 130, pool: 'A' },
      { x: 190, y: 210, pool: 'B' },
      { x: 190, y: 290, pool: 'C' },
      { x: 190, y: 370, pool: 'D' },
    );
  }
}
