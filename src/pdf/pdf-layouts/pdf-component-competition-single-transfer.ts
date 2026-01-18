import { ContainerOptions } from 'src/types/list-tree-container-options.type';
import { Competition } from '../../types/competition.type';
import { PDFDocumentWrapper } from '../pdf.document';
import { PDFComponentCompetition } from './pdf-component-competition';

export class PDFComponentCompetitionSingleTransfer extends PDFComponentCompetition {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected containerOptions: ContainerOptions,
    protected resultAlwaysBottom = false,
  ) {
    super(doc, containerOptions);
  }

  public async draw(
    _competition: Competition,
    _startPositionX: number,
    _startPositionY: number,
    _height: number,
    _resultLineReverse = false,
    _printWinner = false,
    _printResultLine = false,
    _drawNationCode = false,
  ): Promise<void> {
    const containerOptions = this.containerOptions;

    const widthFightNumberContainer = 25,
      widthAthleteContainer = containerOptions.w;

    const x =
      _startPositionX +
      widthFightNumberContainer +
      widthAthleteContainer +
      widthFightNumberContainer;

    const y = _startPositionY;

    // fight number container
    this.doc.rect(x, y, widthFightNumberContainer, _height * 2).stroke();

    // fight number text
    this.drawTextFightNumber(
      _competition.fightNumber.toString(),
      x,
      y,
      _height,
      widthFightNumberContainer,
    );

    // athlete container of a
    this.drawTextAthleteName(
      this.getName(
        _competition.athleteA?.firstName,
        _competition.athleteA?.lastName,
        widthAthleteContainer,
        _competition.result ? ' - ' : undefined,
      ) +
        (_drawNationCode && _competition.athleteA
          ? ' (' +
            (_competition.athleteA?.associationCode ||
              _competition.athleteA?.nationCode) +
            ')'
          : ''),
      widthAthleteContainer,
      _startPositionX + widthFightNumberContainer + widthFightNumberContainer,
      widthFightNumberContainer,
      y - (this.fontSize + 5),
      _height,
    );

    // line for transfer
    this.drawTransferLine(
      _startPositionX + widthAthleteContainer - widthFightNumberContainer,
      y + _height * 2,
      widthAthleteContainer,
      _competition.fightNumberFromB?.toString(),
    );

    this.drawTextAthleteName(
      this.getName(
        _competition.athleteB?.firstName,
        _competition.athleteB?.lastName,
        widthAthleteContainer,
      ) +
        (_drawNationCode && _competition.athleteB
          ? ' (' +
            (_competition.athleteB?.associationCode ||
              _competition.athleteB?.nationCode) +
            ')'
          : ''),
      widthAthleteContainer,
      _startPositionX + widthFightNumberContainer + widthFightNumberContainer,
      widthFightNumberContainer,
      y + _height * 2,
      _height,
    );

    const xFightNumberContainer = _resultLineReverse
      ? x - widthAthleteContainer
      : x;

    // result line
    const lineX = xFightNumberContainer + widthFightNumberContainer;

    const paddingLeft = _resultLineReverse ? 5 : 0; // needs padding for repechage reverse lines
    this.drawResultLine(
      lineX + paddingLeft,
      y + _height,
      widthAthleteContainer - widthFightNumberContainer - paddingLeft,
    );

    this.drawResult(
      xFightNumberContainer + widthFightNumberContainer,
      _startPositionY,
      _height,
      this.fontSize + 1,
      widthAthleteContainer - widthFightNumberContainer,
      _competition,
      _competition.isFinal || this.resultAlwaysBottom ? 1 : undefined,
    );

    if ((_printWinner || _competition.isFinal) && _competition.result) {
      this.drawFinalWinner(
        lineX,
        y + _height,
        _competition,
        widthAthleteContainer - widthFightNumberContainer,
      );
    }
  }

  private drawTransferLine(x: number, y: number, w: number, fightNumberFrom) {
    this.drawResultLine(x, y, w);

    if (fightNumberFrom) {
      this.doc.fontSize(this.fontSize - 2);
      this.drawTextFightNumber(fightNumberFrom, x - 25, y - 23, 25, 25);
      this.setDefaultFont();
    }
    this.drawResultLine(x - 35, y, 10);
  }
}
