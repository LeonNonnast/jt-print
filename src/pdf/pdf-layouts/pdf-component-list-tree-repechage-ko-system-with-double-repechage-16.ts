import { Competition } from 'src/types/competition.type';
import { PDFComponentCompetition } from './pdf-component-competition';
import { PDFComponentCompetitionSingleTransfer } from './pdf-component-competition-single-transfer';
import { PDFComponentCompetitionSmall } from './pdf-component-competition-small';
import { PDFComponentCompetitionTransfer } from './pdf-component-competition-transfer';
import { PDFComponentListTreeRepechage } from './pdf-component-list-tree-repechage';
import { PDFDocumentWrapper } from '../pdf.document';

export class PDFComponentListTreeKoSystemWithDoubleRepechage16 extends PDFComponentListTreeRepechage {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected competitions: Competition[],
  ) {
    super(doc, competitions);
    this.yStart = 430;
  }
  async draw() {
    await this.row1(this.competitions.slice(0, 4));
    await this.row2(
      this.competitions.slice(4, 6),
      new PDFComponentCompetitionSmall(this.doc, this.options),
    );
    await this.row3(
      this.competitions.slice(6, 8),
      new PDFComponentCompetitionSingleTransfer(this.doc, this.options, true),
    );
  }

  protected async row1(_competitions: Competition[]) {
    for (let i = 1, j = 0; i <= _competitions.length; i++, j++) {
      const x = 25;
      const y = this.yStart + this.options.h * 4 * (i - 1);

      await new PDFComponentCompetitionTransfer(
        this.doc,
        this.options,
        false,
      ).draw(_competitions[j], x, y, this.options.h);
    }
  }

  protected async row2(
    _competitions: Competition[],
    component: PDFComponentCompetition,
  ) {
    for (let i = 1, j = 0; i <= _competitions.length * 2; i = i + 2, j++) {
      const x = this.options.w * 1;
      const y = this.yStart + this.options.h * 4 * (i - 1) + this.options.h * 2;

      await component.draw(
        _competitions[j],
        x,
        y - this.options.h,
        this.options.h * 2,
        undefined,
        false,
      );
    }
  }

  protected async row3(
    _competitions: Competition[],
    component: PDFComponentCompetition,
  ) {
    for (let i = 1, j = 0; i <= _competitions.length * 4; i = i + 4, j++) {
      const x = this.options.w * 2;
      const y = this.yStart + this.options.h * 2 * (i - 1) + this.options.h * 3;

      await component.draw(
        _competitions[j],
        x,
        y,
        this.options.h * 2,
        undefined,
        undefined,
        undefined,
        true,
      );
    }
  }
}
