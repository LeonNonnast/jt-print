import { ContainerOptions } from 'src/types/list-tree-container-options.type';
import { Competition } from '../../types/competition.type';
import { PDFComponentCompetition } from './pdf-component-competition';
import { PDFDocumentWrapper } from '../pdf.document';

export class PDFComponentCompetitionTransfer extends PDFComponentCompetition {
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
    _height: number = this.containerOptions.h,
    _resultLineReverse = false,
    _printWinner = false,
    _printResultLine = false,
    _drawNationCode = false,
  ): Promise<void> {
    const containerOptions = this.containerOptions;

    const widthFightNumberContainer = 25,
      widthAthleteContainer = containerOptions.w,
      height = _height;

    const y = _startPositionY;

    const xFightNumberContainer =
      _startPositionX + widthFightNumberContainer + widthAthleteContainer;

    this.doc
      // hr lines
      // top transfer line
      .moveTo(_startPositionX, y + 0)
      .lineTo(_startPositionX + 5, y + 0)
      // top
      .moveTo(_startPositionX + 5 + widthFightNumberContainer, y + 0)
      .lineTo(
        _startPositionX +
          widthFightNumberContainer +
          widthAthleteContainer +
          widthFightNumberContainer,
        y + 0,
      )
      // bottom transfer line
      .moveTo(_startPositionX, y + height * 2)
      .lineTo(_startPositionX + 5, y + height * 2)
      // bottom
      .moveTo(_startPositionX + 5 + widthFightNumberContainer, y + height * 2)
      .lineTo(
        _startPositionX +
          widthFightNumberContainer +
          widthAthleteContainer +
          widthFightNumberContainer,
        y + height * 2,
      )
      // left line of fight number
      .moveTo(xFightNumberContainer, y)
      .lineTo(xFightNumberContainer, y + height * 2)
      // right line of fight number
      .moveTo(xFightNumberContainer + widthFightNumberContainer, y)
      .lineTo(xFightNumberContainer + widthFightNumberContainer, y + height * 2)
      .stroke();

    // fight numbers from
    if (_competition.fightNumberFromA) {
      this.doc.fontSize(this.fontSize - 2);
      this.drawTextFightNumber(
        _competition.fightNumberFromA.toString(),
        _startPositionX + 5,
        y - (_competition.isRepechage ? 24 : 15),
        25,
        widthFightNumberContainer,
      );
      this.setDefaultFont();
    }

    if (_competition.fightNumberFromB) {
      this.doc.fontSize(this.fontSize - 2);
      this.drawTextFightNumber(
        _competition.fightNumberFromB.toString(),
        _startPositionX + 5,
        y + (_competition.isRepechage ? 16 : 9),
        25,
        widthFightNumberContainer,
      );
      this.setDefaultFont();
    }

    // athlete container
    this.drawTextAthleteName(
      this.getName(
        _competition.athleteA?.firstName,
        _competition.athleteA?.lastName,
        widthAthleteContainer,
        _competition.result ? ' - ' : undefined,
      ),
      widthAthleteContainer,
      _startPositionX,
      widthFightNumberContainer,
      y + 3,
      height,
    );

    this.drawTextAthleteName(
      this.getName(
        _competition.athleteB?.firstName,
        _competition.athleteB?.lastName,
        widthAthleteContainer,
        _competition.result ? ' - ' : undefined,
      ),
      widthAthleteContainer,
      _startPositionX,
      widthFightNumberContainer,
      y + height + 7,
      height,
    );

    //fight number container
    this.drawTextFightNumber(
      _competition.fightNumber.toString(),
      xFightNumberContainer,
      y,
      height,
      widthFightNumberContainer,
    );

    const lineX = xFightNumberContainer + widthFightNumberContainer;

    // result line of winner
    this.drawResultLine(
      lineX,
      y + height,
      widthAthleteContainer - widthFightNumberContainer,
    );

    this.drawResult(
      xFightNumberContainer + widthFightNumberContainer,
      _startPositionY,
      height,
      this.fontSize + 1,
      widthAthleteContainer - widthFightNumberContainer,
      _competition,
      this.resultAlwaysBottom ? 1 : undefined,
    );

    if (_printWinner || _competition.isFinal) {
      this.drawFinalWinner(lineX, y + height, _competition);
    }
  }
}
