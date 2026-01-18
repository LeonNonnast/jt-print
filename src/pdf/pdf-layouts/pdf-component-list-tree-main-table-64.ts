import { RoundHeaders } from 'src/types/round-headers.enum';
import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';
import { PDFComponentCompetitionTransfer } from './pdf-component-competition-transfer';

export class PDFComponentListTreeMainTable64 extends PDFComponentListTreeMainTable {
  async draw(): Promise<void> {
    await this.doc.addPageAsync();

    await this.row1(this.competitions.slice(0, 16));
    await this.row2(this.competitions.slice(32, 40));
    await this.row3(this.competitions.slice(48, 52));
    await this.row4(
      this.competitions.slice(56, 58),
      RoundHeaders.QuarterFinals,
      true,
    );
    await this.row5(this.competitions.slice(60), null, false, false);

    await this.drawPoolInfo(
      { x: 380, y: 240, pool: 'A' },
      { x: 380, y: 560, pool: 'B' },
    );

    await this.doc.addPageAsync();

    await this.row1(this.competitions.slice(16, 32));
    await this.row2(this.competitions.slice(40, 48));
    await this.row3(this.competitions.slice(52, 56));
    await this.row4(
      this.competitions.slice(58, 60),
      RoundHeaders.QuarterFinals,
      true,
    );
    await this.row5(this.competitions.slice(61), null, false, false);

    await this.drawPoolInfo(
      { x: 380, y: 250, pool: 'C' },
      { x: 380, y: 570, pool: 'D' },
    );

    await this.doc.addPageAsync();

    const finals = this.competitions.slice(56, 70);

    this.yStart = this.yStart + 25;

    await this.row1(
      finals.slice(-3, -1),
      new PDFComponentCompetitionTransfer(this.doc, this.options, false),
      RoundHeaders.HalfFinals,
    );
    await this.row2(finals.slice(-1), RoundHeaders.Finals);

    this.yStart = this.yStart - 25;
  }
}
