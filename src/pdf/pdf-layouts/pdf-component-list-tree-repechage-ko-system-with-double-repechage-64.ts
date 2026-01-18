import { Competition } from 'src/types/competition.type';
import { PDFComponentCompetition } from './pdf-component-competition';
import { PDFComponentCompetitionSingleTransfer } from './pdf-component-competition-single-transfer';
import { PDFComponentCompetitionSmall } from './pdf-component-competition-small';
import { PDFComponentCompetitionTransfer } from './pdf-component-competition-transfer';
import { PDFComponentListTreeRepechage } from './pdf-component-list-tree-repechage';

export class PDFComponentListTreeKoSystemWithDoubleRepechage64 extends PDFComponentListTreeRepechage {
  async draw() {
    await this.doc.addPageAsync();

    await this.row1(this.competitions.slice(0, 4));
    await this.row2(
      this.competitions.slice(4, 8),
      new PDFComponentCompetitionSingleTransfer(this.doc, this.options, true),
    );

    await this.row3(
      this.competitions.slice(8, 12),
      new PDFComponentCompetitionSingleTransfer(this.doc, this.options),
    );

    await this.row4(
      this.competitions.slice(12, 14),
      new PDFComponentCompetitionSmall(this.doc, this.options),
    );

    await this.row5(
      this.competitions.slice(14, 16),
      new PDFComponentCompetitionSingleTransfer(this.doc, this.options),
    );
  }
  protected async row1(_competitions: Competition[]) {
    for (let i = 1, j = 0; i <= _competitions.length; i++, j++) {
      const x = 25;
      const y = this.yStart + this.options.h * 4 * (i - 1);

      await new PDFComponentCompetitionTransfer(this.doc, this.options).draw(
        _competitions[j],
        x,
        y,
        this.options.h,
      );
    }
  }

  protected async row2(
    _competitions: Competition[],
    component: PDFComponentCompetition,
  ) {
    for (let i = 1, j = 0; i <= _competitions.length * 2; i = i + 2, j++) {
      const x = this.options.w * 1;
      const y = this.yStart + this.options.h * 2 * (i - 1) + this.options.h;

      await component.draw(_competitions[j], x, y, this.options.h);
    }
  }

  protected async row3(
    _competitions: Competition[],
    component: PDFComponentCompetition,
  ) {
    for (let i = 1, j = 0; i <= _competitions.length * 4; i = i + 4, j++) {
      const x = this.options.w * 2;
      const y = this.yStart + this.options.h * 2 + this.options.h * (i - 1);

      await component.draw(_competitions[j], x, y, this.options.h);
    }
  }

  protected async row4(
    _competitions: Competition[],
    component: PDFComponentCompetition,
  ) {
    for (let i = 0; i < _competitions.length; i++) {
      const _competition = _competitions[i];
      const x = this.options.w * 3;
      const y = this.yStart + this.options.h * 2 * (i * 4) + this.options.h * 3;

      await component.draw(
        _competition,
        x,
        y,
        this.options.h * 2,
        undefined,
        false,
      );
    }
  }

  protected async row5(
    _competitions: Competition[],
    component: PDFComponentCompetition,
  ) {
    for (let i = 0; i < _competitions.length; i++) {
      const _competition = _competitions[i];
      const x = this.options.w * 4;
      const y = this.yStart + this.options.h * (3 + i * 8) + this.options.h * 2;
      await component.draw(
        _competition,
        x,
        y,
        this.options.h * 2,
        true,
        undefined,
        undefined,
        true,
      );
    }
  }
}
