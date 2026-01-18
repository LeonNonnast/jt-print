import { Competition } from 'src/types/competition.type';
import { PDFComponentCompetition } from './pdf-component-competition';
import { PDFComponentCompetitionSingleTransfer } from './pdf-component-competition-single-transfer';
import { PDFComponentCompetitionSmall } from './pdf-component-competition-small';
import { PDFComponentCompetitionTransfer } from './pdf-component-competition-transfer';
import { PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage } from './pdf-component-list-tree-repechage-double-ko-system-with-double-repechage';

export class PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage64 extends PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage {
  // draw page with 16 competitions
  public async draw() {
    const page1 = [
      [0, 8],
      [16, 24],
      [32, 36],
      [40, 44],
      [48, 50],
      [52, 54],
    ];

    const page2 = [
      [8, 16],
      [24, 32],
      [36, 40],
      [44, 48],
      [50, 52],
      [54, 56],
    ];

    await this.drawPage(page1);
    await this.drawPage(page2);

    await this.drawFinal();
  }

  protected async drawPage(page: any) {
    await this.doc.addPageAsync();

    await this.col(
      1,
      this.competitions.slice(page[0][0], page[0][1]),
      new PDFComponentCompetitionTransfer(this.doc, this.options),
    );

    await this.col(
      2,
      this.competitions.slice(page[1][0], page[1][1]),
      new PDFComponentCompetitionSingleTransfer(this.doc, this.options),
    );
    if (page.length > 2)
      await this.col(
        3,
        this.competitions.slice(page[2][0], page[2][1]),
        new PDFComponentCompetitionSmall(this.doc, this.options),
      );
    if (page.length > 3)
      await this.col(
        4,
        this.competitions.slice(page[3][0], page[3][1]),
        new PDFComponentCompetitionSingleTransfer(this.doc, this.options),
      );
    if (page.length > 4)
      await this.col(
        5,
        this.competitions.slice(page[4][0], page[4][1]),
        new PDFComponentCompetitionSmall(this.doc, this.options),
      );
    if (page.length > 5)
      await this.col(
        6,
        this.competitions.slice(page[5][0], page[5][1]),
        new PDFComponentCompetitionSingleTransfer(this.doc, this.options, true),
        true,
      );
  }

  private async drawFinal() {
    await this.doc.addPageAsync();

    this.yStart = 90;
    await this.row1(this.competitions.slice(52, 56));

    await this.row2(
      this.competitions.slice(56, 58),
      new PDFComponentCompetitionSmall(this.doc, this.options),
    );

    await this.row3(
      this.competitions.slice(58, 60),
      new PDFComponentCompetitionSingleTransfer(this.doc, this.options),
    );
  }

  protected async row1(_competitions: Competition[]) {
    for (let i = 1, j = 0; i <= _competitions.length; i++, j++) {
      const x = 25;
      const y = this.yStart + this.options.h * 2 * (i - 1);

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
    for (let i = 0; i < _competitions.length; i++) {
      const _competition = _competitions[i];
      const x = this.options.w * 1;
      const y = this.yStart + this.options.h * 1 + this.options.h * (i * 4);
      await component.draw(_competition, x, y, this.options.h);
    }
  }

  protected async row3(
    _competitions: Competition[],
    component: PDFComponentCompetition,
  ) {
    for (let i = 0; i < _competitions.length; i++) {
      const _competition = _competitions[i];
      const x = this.options.w * 2;
      const y = this.yStart + this.options.h * 2 + this.options.h * (i * 4);

      await component.draw(_competition, x, y, this.options.h);
    }
  }

  protected async col(
    _row: number,
    _competitions: Competition[],
    component: PDFComponentCompetition,
    _printWinner = false,
  ) {
    const componentHeight = 8 / _competitions.length;

    for (let i = 0; i < _competitions.length; i++) {
      const _competition = _competitions[i];
      const x = (_row - 1) * this.options.w || 25;

      const getOffsetMultiplicator = () => {
        switch (_row) {
          case 1:
            return 0;
          case 2:
            return 1;
          case 3:
            return 2;
          case 4:
            return 4;
          case 5:
            return 6;
          case 6:
            return 10;
          default:
            return 0;
        }
      };
      const y =
        this.yStart +
        this.options.h * (32 / _competitions.length) * i +
        this.options.h * getOffsetMultiplicator(); // offset

      await component.draw(
        _competition,
        x,
        y,
        this.options.h * componentHeight,
        undefined,
        _printWinner,
      );
    }
  }
}
