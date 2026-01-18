import { Competition } from 'src/types/competition.type';
import { PDFComponentCompetition } from './pdf-component-competition';
import { PDFComponentCompetitionSingleTransfer } from './pdf-component-competition-single-transfer';
import { PDFComponentCompetitionTransfer } from './pdf-component-competition-transfer';
import { PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage } from './pdf-component-list-tree-repechage-double-ko-system-with-double-repechage';

export class PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage8 extends PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage {
  // draw page with 16 competitions
  public async draw() {
    this.yStart = 300;

    await this.col(
      1,
      this.competitions.slice(0, 2),
      new PDFComponentCompetitionTransfer(this.doc, this.options),
    );

    await this.col(
      2,
      this.competitions.slice(2, 4),
      new PDFComponentCompetitionSingleTransfer(this.doc, this.options),
    );
  }

  protected async col(
    _row: number,
    _competitions: Competition[],
    component: PDFComponentCompetition,
  ) {
    const componentHeight = 2 / _competitions.length;

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
        this.options.h * (8 / _competitions.length) * i +
        this.options.h * getOffsetMultiplicator(); // offset

      await component.draw(
        _competition,
        x,
        y,
        this.options.h * componentHeight,
      );
    }
  }
}
