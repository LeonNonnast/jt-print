import { getFullName } from '../../types/athlete-registration.type';
import { Athlete } from '../../types/athlete.type';
import { PDFLayoutAthleteTable } from './pdf-layout-athlete-table';

/**
 * Layout displays athletes grouped by nation and club.
 * each nation block will create a new page
 * columns are: name - JG - Gew - Weighed
 * @export
 * @class PDFLayoutAthleteTableByClub
 * @extends {PDFLayoutAthleteTable}
 */
export class PDFLayoutAthleteTableByClub extends PDFLayoutAthleteTable {
  protected sort() {
    this.athletes
      .sort((a, b) => (a.firstName > b.firstName ? 1 : -1))
      .sort((a, b) => (a.lastName > b.lastName ? 1 : -1))
      .sort((a, b) => (a.associationCode > b.associationCode ? 1 : -1))
      .sort((a, b) => (a.weightedOrder > b.weightedOrder ? 1 : -1))
      .sort((a, b) => (a.clubName > b.clubName ? 1 : -1))
      .sort((a, b) => (a.nationCode > b.nationCode ? 1 : -1));
  }

  async generateTable() {
    let nextRowIndex = this.doc.DOCUMENT_CONTENT_START;

    for (let i = 0; i < this.athletes.length; i++) {
      const athlete = this.athletes[i];

      nextRowIndex = await this._createGroupNationCodeIfNew(
        athlete,
        nextRowIndex,
        true && i > 0,
      );

      nextRowIndex = await this._createGroupClubIfNew(athlete, nextRowIndex);

      nextRowIndex = await this.generateTableItem(nextRowIndex, athlete);
    }
  }

  private async _createGroupNationCodeIfNew(
    athlete,
    nextRowIndex,
    groupOnNewPage,
  ) {
    const getRightText = (): string => {
      const athleteCount = this.athletes.filter(
        (_athlete) => _athlete.nationCode == athlete.nationCode,
      ).length;
      return this.getAthleteText(athleteCount);
    };

    return await this.createGroupIfNew(
      'nationCode',
      athlete,
      nextRowIndex,
      groupOnNewPage,
      undefined,
      getRightText,
    );
  }

  private async _createGroupClubIfNew(athlete, nextRowIndex) {
    const getRightText = (): string => {
      const athleteCount = this.athletes.filter(
        (_athlete) =>
          _athlete.clubName == athlete.clubName &&
          _athlete.nationCode == athlete.nationCode,
      ).length;
      return this.getAthleteText(athleteCount);
    };
    return await this.createGroupIfNew(
      'clubName',
      athlete,
      nextRowIndex,
      false,
      undefined,
      getRightText,
    );
  }

  protected async generateTableHeader(y): Promise<number> {
    this.doc.setFontBold();
    const nextRowIndex: number = await this.generateTableRow(
      y,
      'weighed',
      'name',
      'category',
      'year',
    );
    this.setFontNormal();
    return nextRowIndex;
  }

  protected async generateTableItem(y, athlete: Athlete): Promise<number> {
    return await this.generateTableRow(
      y,
      athlete.weighed ? 'x' : '',
      getFullName(athlete, 200),
      athlete.category,
      athlete.yearOfBirth,
    );
  }

  private async generateTableRow(y, col1, col2, col3, col4): Promise<number> {
    this.doc
      .text(col1, 35, y, { align: 'right', width: 10 })
      .text(col2, 50, y, { align: 'left', width: 200 })
      .text(col3, 300, y, { align: 'left', width: 200 })
      .text(col4, 500, y, { align: 'right', width: 60 });

    return await this.calculateNextRowIndex(y);
  }
}
