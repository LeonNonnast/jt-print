import { Competition } from '../../types/competition.type';
import { ContainerOptions } from '../../types/list-tree-container-options.type';
import { PDFDocumentWrapper } from '../pdf.document';

export abstract class PDFComponentCompetition {
  protected padding = 5;

  public constructor(
    protected doc: PDFDocumentWrapper,
    protected containerOptions: ContainerOptions,
  ) {
    this.setDefaultFont();
  }

  protected setDefaultFont() {
    this.doc.lineWidth(1);
    this.doc.fillColor('#000');
    this.doc.strokeColor('#444');
    this.doc.fontSize(this.fontSize);
  }

  public abstract draw(
    _competition: Competition | undefined,
    _startPositionX: number,
    _startPositionY: number,
    _height: number,
    _resultLineReverse?: boolean,
    _printWinner?: boolean,
    _printResultLine?: boolean,
    _drawNationCode?: boolean,
  ): Promise<void>;

  get fontSize() {
    return 8;
  }

  protected drawResultLine(_x, _y, _w): void {
    this.doc
      .moveTo(_x, _y)
      .lineTo(_x + _w, _y)
      .stroke();
  }

  protected drawResult(
    _x,
    _y,
    _h,
    _p,
    _w,
    _competition: Competition = null,
    _m = _competition?.fightNumber % 2 == 0 ? -1 : 1,
  ): void {
    const resultLineW = _w / 4;
    const result = _competition?.result;

    // resultline to top or bottom
    //multiplicator;
    const multiplicator = _m;

    const p = _p * multiplicator;

    const y = _y + _h + p;

    this.doc.fontSize(this.fontSize);

    this.doc
      .moveTo(_x + resultLineW, y)
      .lineTo(_x + resultLineW * 3, y)
      .stroke();

    this.doc
      .moveTo(_x + _w / 2, y)
      .lineTo(_x + _w / 2, _y + _h)
      .stroke();

    if (result) {
      const formattedPoints = this.doc.formatPoints(result);
      this.doc.text(
        result.time == undefined || result.time == '00:00'
          ? '--:--'
          : result.time,
        _x + resultLineW - 12,
        p > 0 ? _y + _h : y,
        {
          width: resultLineW + 10,
          align: 'right',
        },
      );

      this.doc.text(
        formattedPoints,
        _x + resultLineW * 2 + 3,
        p > 0 ? _y + _h : y,
        {
          width: resultLineW + 10,
          align: 'left',
        },
      );
    }
    this.setDefaultFont();
  }

  protected drawFinalWinner(_x, _y, _competition, w = 100) {
    if (_competition.result)
      this.doc.text(
        _competition.result?.isWinnerA
          ? this.getName(
              _competition.athleteA?.firstName,
              _competition.athleteA?.lastName,
              w,
            )
          : this.getName(
              _competition.athleteB?.firstName,
              _competition.athleteB?.lastName,
              w,
            ),
        _x + 3,
        _y - 15,
        {
          width: w,
          align: 'left',
        },
      );
  }

  protected getName(
    _firstName: string,
    _lastName: string,
    _width: number,
    _emptyText = '',
  ) {
    if (_lastName == undefined) {
      return _emptyText;
    } else if (_lastName.length * 8 > _width) {
      return _lastName;
    } else if ((_firstName + ' ' + _lastName).length * 8 > _width) {
      return _firstName.charAt(0) + '. ' + _lastName;
    } else {
      return _firstName + ' ' + _lastName;
    }
  }

  protected drawTextFightNumber(
    _fightNumber: string,
    _x: number,
    _y: number,
    _h: number,
    _w: number,
  ) {
    this.doc.text(_fightNumber, _x, _y + _h - this.fontSize + 3, {
      align: 'center',
      width: _w,
    });
  }

  protected drawTextAthleteName(
    _name: string,
    _widthAthleteContainer: number,
    _startPositionX: number,
    _widthFightNumberContainer: number,
    _startPositionY: number,
    _height: number,
  ) {
    this.doc.fontSize(this.fontSize);
    this.doc.text(
      _name,
      _startPositionX + _widthFightNumberContainer + this.padding,
      _startPositionY,
      {
        width: _widthAthleteContainer,
        height: _height / 2,
      },
    );
    this.setDefaultFont();
  }
}
