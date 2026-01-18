import { Competition } from '../../types/competition.type';
import { PDFComponentCompetition } from './pdf-component-competition';

export class PDFComponentCompetitionLarge extends PDFComponentCompetition {
  public async draw(
    _competition: Competition,
    _startPositionX: number,
    _startPositionY: number,
    _height: number = this.containerOptions.h,
    _resultLineReverse = false,
    _printWinner = false,
    _drawNationCode = false,
  ): Promise<void> {
    const containerOptions = this.containerOptions;

    const widthFightNumberContainer = 25,
      widthAthleteContainer = containerOptions.w,
      height = _height;

    const textOptionsNumber = {
      height,
      width: widthFightNumberContainer - this.padding,
      align: 'right',
    };

    const xFightNumberContainer =
      _startPositionX + widthFightNumberContainer + widthAthleteContainer;

    this.doc
      // left line of start number
      .moveTo(_startPositionX, _startPositionY)
      .lineTo(_startPositionX, _startPositionY + height * 2)
      // right line of start number
      .moveTo(_startPositionX + widthFightNumberContainer, _startPositionY)
      .lineTo(
        _startPositionX + widthFightNumberContainer,
        _startPositionY + height * 2,
      )
      // hr lines
      // top
      .moveTo(_startPositionX, _startPositionY + 0)
      .lineTo(
        _startPositionX +
          widthFightNumberContainer +
          widthAthleteContainer +
          widthFightNumberContainer,
        _startPositionY + 0,
      )
      // center
      .moveTo(_startPositionX, _startPositionY + height)
      .lineTo(
        _startPositionX + widthFightNumberContainer + widthAthleteContainer,
        _startPositionY + height,
      )
      // bottom
      .moveTo(_startPositionX, _startPositionY + height * 2)
      .lineTo(
        _startPositionX +
          widthFightNumberContainer +
          widthAthleteContainer +
          widthFightNumberContainer,
        _startPositionY + height * 2,
      )
      // left line of fight number
      .moveTo(xFightNumberContainer, _startPositionY)
      .lineTo(xFightNumberContainer, _startPositionY + height * 2)
      // right line of fight number
      .moveTo(
        xFightNumberContainer + widthFightNumberContainer,
        _startPositionY,
      )
      .lineTo(
        xFightNumberContainer + widthFightNumberContainer,
        _startPositionY + height * 2,
      )
      .stroke();

    // start number container
    this.doc
      .text(
        _competition.startNumberA?.toString(),
        _startPositionX,
        _startPositionY,
        textOptionsNumber,
      )
      .text(
        _competition.startNumberB?.toString(),
        _startPositionX,
        _startPositionY + height,
        textOptionsNumber,
      );

    // athlete container
    this.drawTextAthleteName(
      this.getName(
        _competition.athleteA?.firstName,
        _competition.athleteA?.lastName,
        widthAthleteContainer,
        ' - ',
      ),
      widthAthleteContainer,
      _startPositionX,
      widthFightNumberContainer,
      _startPositionY,
      height,
    );

    this.drawTextAthleteName(
      this.getName(
        _competition.athleteB?.firstName,
        _competition.athleteB?.lastName,
        widthAthleteContainer,
        ' - ',
      ),
      widthAthleteContainer,
      _startPositionX,
      widthFightNumberContainer,
      _startPositionY + height,
      height,
    );

    // association or nation code
    this.drawCustomInfo(
      _competition.athleteA?.associationCode ||
        _competition.athleteA?.nationCode ||
        '',
      _startPositionX,
      _startPositionY,
      widthAthleteContainer,
      height,
    );

    this.drawCustomInfo(
      _competition.athleteB?.associationCode ||
        _competition.athleteB?.nationCode ||
        '',
      _startPositionX,
      _startPositionY + height,
      widthAthleteContainer,
      height,
    );

    //fight number container
    this.drawTextFightNumber(
      _competition.fightNumber.toString(),
      xFightNumberContainer,
      _startPositionY,
      height,
      widthFightNumberContainer,
    );

    const lineX = xFightNumberContainer + widthFightNumberContainer;

    // result line
    this.drawResultLine(
      lineX,
      _startPositionY + height,
      widthAthleteContainer - widthFightNumberContainer,
    );

    this.drawResult(
      xFightNumberContainer + widthFightNumberContainer,
      _startPositionY,
      height,
      this.fontSize + 1,
      widthAthleteContainer - widthFightNumberContainer,
      _competition,
    );

    if ((_printWinner || _competition.isFinal) && _competition.result) {
      this.drawFinalWinner(lineX, _startPositionY + height, _competition);
    }
  }
  drawCustomInfo(
    customInfo: string,
    _startPositionX: number,
    _startPositionY: number,
    widthAthleteContainer: number,
    height: number,
  ) {
    this.doc.setFontBold();
    this.doc.fontSize(this.fontSize - 2);
    this.doc.fillColor('#898c8a');

    this.doc.text(
      customInfo,
      _startPositionX + widthAthleteContainer + this.padding,
      _startPositionY + height / 2,
      {
        align: 'right',
        width: 18,
        height: 20,
      },
    );

    this.doc.setFontNormal();
    this.setDefaultFont();
  }
}
