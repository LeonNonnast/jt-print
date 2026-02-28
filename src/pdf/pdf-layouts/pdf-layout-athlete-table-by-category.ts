import { getFullName } from '../../types/athlete-registration.type';
import { Athlete } from '../../types/athlete.type';
import { PDFLayoutAthleteTable } from './pdf-layout-athlete-table';

/**
 * Layout displays athletes grouped by category
 *
 * columns are name - club - JG - Land - weighed
 * @export
 * @class PDFLayoutAthleteTableByCategory
 * @extends {PDFLayoutAthleteTable}
 */
export class PDFLayoutAthleteTableByCategory extends PDFLayoutAthleteTable {
  protected sort() {
    this.athletes.sort((a, b) => {
      // Primary: weightedOrder (category ordering)
      if ((a.weightedOrder ?? 0) !== (b.weightedOrder ?? 0))
        return (a.weightedOrder ?? 0) - (b.weightedOrder ?? 0);
      // Secondary: category name (ensures same category stays together)
      if ((a.category ?? '') !== (b.category ?? ''))
        return (a.category ?? '') > (b.category ?? '') ? 1 : -1;
      // Tertiary: lastName, firstName within category
      if (a.lastName !== b.lastName)
        return a.lastName > b.lastName ? 1 : -1;
      return a.firstName > b.firstName ? 1 : -1;
    });
  }

  async generateTable() {
    let nextRowIndex = this.doc.DOCUMENT_CONTENT_START;

    for (let i = 0; i < this.athletes.length; i++) {
      const athlete = this.athletes[i];

      nextRowIndex = await this._createGroupCategory(
        athlete,
        nextRowIndex,
        true && i > 0,
      );

      nextRowIndex = await this.generateTableItem(nextRowIndex, athlete);
    }
  }

  private async _createGroupCategory(athlete, nextRowIndex, groupOnNewPage) {
    const getRightText = (): string => {
      const athletesOfCategory = this.athletes.filter(
        (_athlete) => _athlete.category == athlete.category,
      );

      const athletesOfCategoryWeighed = athletesOfCategory.filter(
        (_athlete) => _athlete.weighed == true,
      );

      return (
        athletesOfCategoryWeighed.length +
        ' / ' +
        athletesOfCategory.length +
        this.getAthleteText('')
      );
    };
    return await this.createGroupIfNew(
      'category',
      athlete,
      nextRowIndex,
      groupOnNewPage,
      undefined,
      getRightText,
    );
  }

  protected async generateTableHeader(y) {
    this.doc.setFontBold();
    const nextRowIndex: number = await this.generateTableRow(
      y,
      'weighed',
      'name',
      'club',
      'year',
    );
    this.setFontNormal();
    return nextRowIndex;
  }

  protected async generateTableItem(y, athlete: Athlete) {
    return await this.generateTableRow(
      y,
      athlete.weighed ? 'x' : '',
      getFullName(athlete, 200, true),
      athlete.nationCode + ' - ' + athlete.clubName,
      athlete.yearOfBirth,
    );
  }

  private async generateTableRow(y, col1, col2, col3, col4) {
    this.doc
      .text(col1, 35, y, { align: 'right', width: 10 })
      .text(col2, 50, y, { align: 'left', width: 200 })
      .text(col3, 300, y, { align: 'left', width: 200 })
      .text(col4, 500, y, { align: 'right', width: 60 });

    return await this.calculateNextRowIndex(y);
  }
}
