import { getFullName } from '../../types/athlete-registration.type';
import { PDFComponentPool } from './pdf-component-pool';

export class PDFComponentPoolSingle extends PDFComponentPool {
  private setDefaultFont() {
    this.doc.setFontNormal();
    this.doc.lineWidth(1);
    this.doc.strokeColor('#444');
    this.doc.fillColor('#000');
    this.doc.fontSize(10);
  }

  private drawLine(xFrom, yFrom, xTo, yTo) {
    this.doc.moveTo(xFrom, yFrom).lineTo(xTo, yTo).stroke();
  }

  private getAthletes() {
    const athletes = [];
    this.competitions.forEach((competition) => {
      const foundNotA =
        athletes.findIndex(
          ({ startNumber }) => competition.athleteA?.startNumber == startNumber,
        ) == -1;

      if (foundNotA && competition.athleteA)
        athletes.push(competition.athleteA);

      const foundNotB =
        athletes.findIndex(
          ({ startNumber }) => competition.athleteB?.startNumber == startNumber,
        ) == -1;

      if (foundNotB && competition.athleteB)
        athletes.push(competition.athleteB);
    });

    return athletes;
  }

  async draw() {
    await this.doc.addPageAsync();

    this.setDefaultFont();

    const xStart = 25;
    const yStart = 90;
    const rowHeight = 30;
    const widthCompetitionContainer = 25;
    const widthResultContainer = widthCompetitionContainer;
    const widthAthleteContainer = 125;

    // hint: competition length max 15. | for 6
    const fullWidth =
      xStart +
      this.competitions.length * widthCompetitionContainer +
      widthAthleteContainer +
      widthResultContainer;

    const getRowYByAthleteIndex = (_index: number) => {
      return yStart + rowHeight * (_index + 1);
    };

    const athletes = this.getAthletes();
    // draw rows
    athletes.forEach((athlete, index) => {
      const rowY = getRowYByAthleteIndex(index);
      this.drawLine(xStart, rowY, fullWidth, rowY);

      // startnumber + name
      const fullName = getFullName(athlete, widthAthleteContainer);
      this.doc.text(athlete.startNumber + ' - ' + fullName, xStart, rowY, {
        align: 'left',
        width: widthAthleteContainer - 5,
      });

      // nation
      this.doc.fontSize(8);
      this.doc.text(
        athlete.associationCode || athlete.nationCode,
        xStart,
        rowY + rowHeight / 2,
        {
          align: 'right',
          width: widthAthleteContainer - 5,
        },
      );

      this.setDefaultFont();

      // results
      // const sumPoints = this.calculateSumResult(athlete);

      this.doc.text(athlete.rank, fullWidth - widthResultContainer, rowY + 10, {
        align: 'center',
        width: widthResultContainer,
      });
    });

    // time line
    const rowY = getRowYByAthleteIndex(athletes.length);
    this.drawLine(xStart + widthAthleteContainer, rowY, fullWidth, rowY);

    // draw cols
    const fullHeight =
      rowHeight + rowHeight * (this.listInfo.athleteCount + 0.5); // plus 0.5 for time
    // athlete container
    this.doc
      .moveTo(xStart + widthAthleteContainer, yStart)
      .lineTo(xStart + widthAthleteContainer, yStart + fullHeight)
      .stroke();

    // competition container
    const xCompetitionStart = xStart + widthAthleteContainer;
    this.competitions.forEach((competition, index) => {
      const xCompetition = widthCompetitionContainer * (index + 1);

      // horizontal lines
      this.drawLine(
        xCompetitionStart + xCompetition,
        yStart,
        xCompetitionStart + xCompetition,
        yStart + fullHeight,
      );

      // fight number
      this.doc.text(
        competition.fightNumber.toString(),
        xCompetitionStart + widthCompetitionContainer * index, // col
        yStart + 10,
        {
          align: 'center',
          width: widthCompetitionContainer,
        },
      );

      // results and no fight rect
      athletes.forEach((athlete, athleteIndex) => {
        const cellY = getRowYByAthleteIndex(athleteIndex);
        const cellX = xCompetitionStart + widthCompetitionContainer * index;

        const drawTime = (time, x) => {
          // draw time
          this.doc.fontSize(8);
          this.doc.text(
            time,
            x, // col
            rowY + 3,
            {
              align: 'center',
              width: widthCompetitionContainer,
            },
          );
          this.setDefaultFont();
        };

        const drawResult = (x, y, points, countWin) => {
          // if (countWin == '1') this.doc.setFontBold();
          this.doc.text(
            points,
            x, // col
            y + 5,
            {
              align: 'center',
              width: widthCompetitionContainer,
            },
          );
          this.setDefaultFont();

          this.doc.fontSize(8);
          this.doc.fill('#444');
          this.doc.text(countWin, x, y + rowHeight / 2 + 2, {
            align: 'right',
            width: widthCompetitionContainer - 2, // padding right
          });
          this.setDefaultFont();
        };
        // current competition has current athlete
        if (
          athlete.startNumber == competition.athleteA?.startNumber ||
          athlete.startNumber == competition.athleteB?.startNumber
        ) {
          if (competition.result) {
            const isAthleteA =
              athlete.startNumber == competition.athleteA?.startNumber;

            const points = isAthleteA
              ? competition.result.athleteAPoints
              : competition.result.athleteBPoints;

            const countWin =
              (isAthleteA && competition.result.isWinnerA) ||
              (!isAthleteA && !competition.result.isWinnerA)
                ? '1'
                : '0';
            drawResult(cellX, cellY, points, countWin);

            if (isAthleteA) {
              // draw time only ones
              drawTime(competition.result.time, cellX);
            }
          }
        } else {
          // no fight
          const padding = 2;
          this.doc
            .rect(
              cellX + padding,
              cellY + padding,
              widthCompetitionContainer - padding * 2,
              rowHeight - padding * 2,
            )
            .lineWidth(0)
            .fillAndStroke('#eee');
          this.setDefaultFont();
        }
      });
    });
  }

  // private calculateSumResult(_athlete: Athlete): number {
  //   let sumPoints = 0;
  //   this.competitions.forEach((_competition) => {
  //     const winnerA =
  //       Number(_competition.result?.athleteAPoints || 0) >
  //       Number(_competition.result?.athleteBPoints || 0);
  //     if (_competition.athleteA.id == _athlete.id && winnerA) {
  //       sumPoints = sumPoints + Number(_competition.result.athleteAPoints);
  //     } else if (_competition.athleteB.id == _athlete.id && !winnerA) {
  //       sumPoints =
  //         sumPoints + Number(_competition.result?.athleteBPoints || 0);
  //     }
  //   });
  //   return sumPoints;
  // }
}
