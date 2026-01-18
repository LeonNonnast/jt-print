import { ContainerOptions } from '../../types/list-tree-container-options.type';
import { Competition } from '../../types/competition.type';
import { PDFDocumentWrapper } from '../pdf.document';
import { PDFComponentCompetition } from './pdf-component-competition';

export class PDFComponentCompetitionSmall extends PDFComponentCompetition {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected containerOptions: ContainerOptions,
    protected resultAlwaysBottom = true,
  ) {
    super(doc, containerOptions);
  }

  public async draw(
    _competition: Competition,
    _startPositionX: number,
    _startPositionY: number,
    _height: number,
    _resultLineReverse = false,
    _printWinner = true,
    _printResultLine = true,
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

    // athlete container
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

    this.drawTextAthleteName(
      this.getName(
        _competition.athleteB?.firstName,
        _competition.athleteB?.lastName,
        widthAthleteContainer,
        _competition.result ? ' - ' : undefined,
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

    // result line

    const xFightNumberContainer = _resultLineReverse
      ? x - widthAthleteContainer
      : x;

    const lineX = xFightNumberContainer + widthFightNumberContainer;

    if (_printResultLine) {
      const printResultContainerBottom =
        (_competition.isRepechage || _printWinner || _competition.isFinal) &&
        this.resultAlwaysBottom;

      this.drawResult(
        xFightNumberContainer + widthFightNumberContainer,
        _startPositionY,
        _height,
        this.fontSize + 1,
        widthAthleteContainer - widthFightNumberContainer,
        _competition,
        printResultContainerBottom ? 1 : undefined, // always to bottom when repechage
      );
      this.drawResultLine(
        lineX,
        y + _height,
        widthAthleteContainer - widthFightNumberContainer,
      );
    }

    if ((_printWinner || _competition.isFinal) && _competition.result) {
      this.drawFinalWinner(lineX, y + _height, _competition);
    }
  }
}
