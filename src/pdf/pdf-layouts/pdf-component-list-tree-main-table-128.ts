import { RoundHeaders } from 'src/types/round-headers.enum';
import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';
import { PDFComponentCompetitionTransfer } from './pdf-component-competition-transfer';

export class PDFComponentListTreeMainTable128 extends PDFComponentListTreeMainTable {
  async draw(): Promise<void> {
    // Pool A
    await this.doc.addPageAsync();
    await this.row1(this.competitions.slice(0, 16));
    await this.row2(this.competitions.slice(64, 72));
    await this.row3(this.competitions.slice(96, 100));
    await this.row4(this.competitions.slice(112, 114));
    await this.row5(this.competitions.slice(120), null, false, false, false);

    await this.drawPoolInfo({ x: 400, y: 410, pool: 'A' });

    // Pool B
    await this.doc.addPageAsync();

    await this.row1(this.competitions.slice(16, 32));
    await this.row2(this.competitions.slice(72, 80));
    await this.row3(this.competitions.slice(100, 104));
    await this.row4(this.competitions.slice(114, 116));
    await this.row5(this.competitions.slice(121), null, false, false, false);

    await this.drawPoolInfo({ x: 400, y: 410, pool: 'B' });

    // Pool C
    await this.doc.addPageAsync();

    await this.row1(this.competitions.slice(32, 48));
    await this.row2(this.competitions.slice(80, 88));
    await this.row3(this.competitions.slice(104, 108));
    await this.row4(this.competitions.slice(116, 118));
    await this.row5(this.competitions.slice(122), null, false, false, false);

    await this.drawPoolInfo({ x: 400, y: 410, pool: 'C' });

    // Pool D
    await this.doc.addPageAsync();

    await this.row1(this.competitions.slice(48, 64));
    await this.row2(this.competitions.slice(88, 96));
    await this.row3(this.competitions.slice(108, 112));
    await this.row4(this.competitions.slice(118, 120));
    await this.row5(this.competitions.slice(123), null, false, false, false);
    await this.drawPoolInfo({ x: 400, y: 410, pool: 'D' });

    await this.doc.addPageAsync();

    const finals = this.competitions.slice(120, 134);

    this.yStart = this.yStart + 25;

    await this.row1(
      finals.slice(0, 4),
      new PDFComponentCompetitionTransfer(this.doc, this.options, false),
      RoundHeaders.QuarterFinals,
      true,
    );
    await this.row2(finals.slice(-3, -1), RoundHeaders.HalfFinals);
    await this.row3(finals.slice(-1), RoundHeaders.Finals);

    this.yStart = this.yStart - 25;
  }
}
