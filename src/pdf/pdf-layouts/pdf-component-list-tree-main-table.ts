import { buildContainerOptions } from 'src/types/list-tree-container-options.type';
import { Competition } from '../../types/competition.type';
import { PDFComponentCompetitionLarge } from './pdf-component-competition-large';
import { PDFComponentCompetitionSmall } from './pdf-component-competition-small';
import { PDFDocumentWrapper } from '../pdf.document';
import { PDFComponentCompetition } from './pdf-component-competition';
import { PDFRoundHeaderComponent } from './pdf-round-header-component';
import { RoundHeaders } from 'src/types/round-headers.enum';

export abstract class PDFComponentListTreeMainTable {
  protected options = buildContainerOptions(100, 20);

  protected yStart = 100;
  protected yStartRoundHeader = this.yStart - 20;

  public constructor(
    protected doc: PDFDocumentWrapper,
    protected competitions: Competition[],
  ) {}

  abstract draw(): Promise<void>;

  protected drawPoolInfo(
    ..._textList: { x: number; y: number; pool: string }[]
  ) {
    _textList.forEach((_text) => {
      this.doc
        .fontSize(18)
        .opacity(0.6)
        .text('Pool ' + _text.pool, _text.x, _text.y, {});
    });
    this.doc.opacity(1);
  }

  protected isFinalOrHalfFinal(_roundHeaders: RoundHeaders): boolean {
    return (
      _roundHeaders == RoundHeaders.Finals ||
      _roundHeaders == RoundHeaders.HalfFinals
    );
  }

  protected async row1(
    _competitions: Competition[],
    _component: PDFComponentCompetition = new PDFComponentCompetitionLarge(
      this.doc,
      this.options,
    ),
    _roundHeaders: RoundHeaders = RoundHeaders.Round1,
    _poolFinal = false,
  ) {
    const x = 25;
    await new PDFRoundHeaderComponent(this.doc, _roundHeaders, _poolFinal).draw(
      x,
      this.yStartRoundHeader,
      150,
    );

    for (let i = 1, j = 0; i <= _competitions.length; i++, j++) {
      const y = this.yStart + this.options.h * 2 * (i - 1);
      await _component.draw(
        _competitions[j],
        x,
        y,
        this.options.h,
        undefined,
        false,
        undefined,
      );
    }
  }

  protected async row2(
    _competitions: Competition[],
    _roundHeaders: RoundHeaders = RoundHeaders.Round2,
    _poolFinal = false,
  ) {
    const x = this.options.w * 1;
    await new PDFRoundHeaderComponent(this.doc, _roundHeaders, _poolFinal).draw(
      x + 75,
      this.yStartRoundHeader,
      this.options.w,
    );

    for (let i = 1, j = 0; i <= _competitions.length * 2; i = i + 2, j++) {
      const y = this.yStart + this.options.h * 2 * (i - 1) + this.options.h;
      await new PDFComponentCompetitionSmall(this.doc, this.options).draw(
        _competitions[j],
        x,
        y,
        this.options.h,
        undefined,
        false,
        undefined,
      );
    }
  }

  protected async row3(
    _competitions: Competition[],
    _roundHeaders: RoundHeaders = RoundHeaders.Round3,
    _poolFinal = false,
  ) {
    const x = this.options.w * 2;
    await new PDFRoundHeaderComponent(this.doc, _roundHeaders, _poolFinal).draw(
      x + 75,
      this.yStartRoundHeader,
      this.options.w,
    );

    for (let i = 1, j = 0; i <= _competitions.length * 4; i = i + 4, j++) {
      const competitionHeight = this.options.h * 2;
      const y = this.yStart + this.options.h * 2 * (i - 1) + competitionHeight;

      await new PDFComponentCompetitionSmall(this.doc, this.options).draw(
        _competitions[j],
        x,
        y,
        competitionHeight,
        undefined,
        false,
        undefined,
        this.isFinalOrHalfFinal(_roundHeaders),
      );
    }
  }

  protected async row4(
    _competitions: Competition[],
    _roundHeaders: RoundHeaders = RoundHeaders.Round4,
    _poolFinal = false,
  ) {
    const x = this.options.w * 3;

    await new PDFRoundHeaderComponent(this.doc, _roundHeaders, _poolFinal).draw(
      x + 75,
      this.yStartRoundHeader,
      this.options.w,
    );

    for (let i = 1, j = 0; i <= _competitions.length * 8; i = i + 8, j++) {
      const competitionHeight = this.options.h * 4;

      const y = this.yStart + this.options.h * 2 * (i - 1) + competitionHeight;

      await new PDFComponentCompetitionSmall(this.doc, this.options).draw(
        _competitions[j],
        x,
        y,
        competitionHeight,
        undefined,
        false,
        undefined,
        this.isFinalOrHalfFinal(_roundHeaders),
      );
    }
  }

  protected async row5(
    _competitions: Competition[],
    _roundHeaders: RoundHeaders = RoundHeaders.Round5,
    _printWinner = true,
    _printResultLine = true,
    _poolFinal = false,
  ) {
    const x = this.options.w * 4;
    const competitionHeight = this.options.h * 8;

    const y = this.yStart + competitionHeight; // start + offset

    await new PDFRoundHeaderComponent(this.doc, _roundHeaders, _poolFinal).draw(
      x + 75,
      this.yStartRoundHeader,
      this.options.w,
    );

    await new PDFComponentCompetitionSmall(this.doc, this.options).draw(
      _competitions[0],
      x,
      y,
      competitionHeight,
      true,
      _printWinner,
      _printResultLine,
      this.isFinalOrHalfFinal(_roundHeaders),
    );
  }
}
