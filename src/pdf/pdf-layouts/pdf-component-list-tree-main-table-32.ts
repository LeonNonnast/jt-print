import { RoundHeaders } from 'src/types/round-headers.enum';
import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';

export class PDFComponentListTreeMainTable32 extends PDFComponentListTreeMainTable {
  async draw(): Promise<void> {
    await this.doc.addPageAsync();

    await this.row1(this.competitions.slice(0, 16));
    await this.row2(this.competitions.slice(16, 24));
    await this.row3(
      this.competitions.slice(24, 28),
      RoundHeaders.QuarterFinals,
      true,
    );
    await this.row4(this.competitions.slice(-3, -1), RoundHeaders.HalfFinals);
    await this.row5(this.competitions.slice(-1), RoundHeaders.Finals);

    await this.drawPoolInfo(
      { x: 290, y: 170, pool: 'A' },
      { x: 290, y: 330, pool: 'B' },
      { x: 290, y: 490, pool: 'C' },
      { x: 290, y: 650, pool: 'D' },
    );
  }
}
