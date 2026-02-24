import { PDFLayoutList } from './pdf-layout-list';
import { Systems } from '../../types/systems.enum';
import { Competition } from '../../types/competition.type';
import { DocumentInfo } from '../../types/document-info.type';
import { ListInfo } from '../../types/list-info.type';
import { getFullName } from '../../types/athlete-registration.type';

export class PDFLayoutListJapanischesTurnier extends PDFLayoutList {
  protected constructor(
    documentInfo: DocumentInfo,
    protected listInfo: ListInfo,
    protected competitions: Competition[],
  ) {
    super(documentInfo, listInfo, competitions);
  }

  static Construct(
    documentInfo: DocumentInfo,
    listInfo: ListInfo,
    competitions: Competition[],
  ): PDFLayoutListJapanischesTurnier {
    return new PDFLayoutListJapanischesTurnier(
      documentInfo,
      listInfo,
      competitions,
    );
  }

  protected getListSystem(): Systems {
    return Systems.JapanischesTurnier;
  }

  protected getListSize(): number {
    return this.listInfo.athleteCount || this.listInfo.size;
  }

  protected get totalPages(): number {
    // Estimate: header ~90pt, each fight row ~22pt, section heading ~30pt
    const mainFights = this.mainRoundCompetitions.length;
    const consolationFights = this.consolationRoundCompetitions.length;
    const usableHeight = 660; // 750 - some padding
    const rowHeight = 22;
    const sectionHeadingHeight = 30;
    const tableHeaderHeight = 22;

    const mainHeight =
      sectionHeadingHeight + tableHeaderHeight + mainFights * rowHeight;
    const consolationHeight =
      consolationFights > 0
        ? sectionHeadingHeight + tableHeaderHeight + consolationFights * rowHeight
        : 0;

    const totalHeight = mainHeight + consolationHeight;
    return Math.ceil(totalHeight / usableHeight);
  }

  /**
   * Main round competitions (not repechage)
   */
  private get mainRoundCompetitions(): Competition[] {
    return this.competitions.filter((c) => !c.isRepechage);
  }

  /**
   * Consolation round competitions (Trostrunde / repechage)
   */
  private get consolationRoundCompetitions(): Competition[] {
    return this.competitions.filter((c) => c.isRepechage);
  }

  public async generate(): Promise<void> {
    this.setPageTitle('Hauptrunde');
    await this.doc.addPageAsync();

    const headerEndY = 90;
    let currentY = headerEndY;

    // -- Main Round --
    currentY = this.drawSectionHeading('Hauptrunde', currentY);
    currentY = this.drawFightTable(this.mainRoundCompetitions, currentY);

    // -- Consolation Round (Trostrunde) --
    const consolationFights = this.consolationRoundCompetitions;
    if (consolationFights.length > 0) {
      currentY += 15;

      // Check if we need a new page
      const neededHeight = 22 + 22 + consolationFights.length * 22;
      if (currentY + neededHeight > this.doc.DOCUMENT_CONTENT_END) {
        this.setPageTitle('Trostrunde');
        await this.doc.addPageAsync();
        currentY = 90;
      }

      currentY = this.drawSectionHeading('Trostrunde', currentY);
      currentY = this.drawFightTable(consolationFights, currentY);
    }
  }

  /**
   * Draw a section heading at a given Y position.
   */
  private drawSectionHeading(label: string, y: number): number {
    this.doc.setFontBold();
    this.doc.fontSize(12);
    this.doc.text(label, 50, y, { align: 'left', width: 460 });
    this.doc.setFontNormal();
    this.doc.fontSize(9);
    return y + 22;
  }

  /**
   * Draw the fight table with columns: Nr, Athlete A, Athlete B, Result
   */
  private drawFightTable(fights: Competition[], startY: number): number {
    const colX = {
      nr: 50,
      athleteA: 80,
      athleteB: 290,
      result: 490,
    };
    const colW = {
      nr: 25,
      athlete: 200,
      result: 60,
    };
    const rowHeight = 22;
    let y = startY;

    // Table header
    this.doc.setFontBold();
    this.doc.fontSize(8);
    this.doc.text('Nr.', colX.nr, y + 5, { width: colW.nr });
    this.doc.text('Athlet A', colX.athleteA, y + 5, { width: colW.athlete });
    this.doc.text('Athlet B', colX.athleteB, y + 5, { width: colW.athlete });
    this.doc.text('Ergebnis', colX.result, y + 5, { width: colW.result });
    this.doc.setFontNormal();
    this.doc.fontSize(9);

    y += rowHeight;
    this.doc.addHr(y - 4, '#000000', 1);

    // Fight rows
    for (let i = 0; i < fights.length; i++) {
      const fight = fights[i];

      // Alternate row background
      if (i % 2 === 0) {
        this.doc
          .rect(colX.nr, y - 2, 510, rowHeight)
          .fill('#f5f5f5')
          .fillColor('#000000');
      }

      // Fight number
      this.doc.setFontBold();
      this.doc.fontSize(9);
      this.doc.text(
        fight.fightNumber?.toString() || '',
        colX.nr,
        y + 4,
        { width: colW.nr, align: 'center' },
      );
      this.doc.setFontNormal();
      this.doc.fontSize(9);

      // Athlete A
      const athleteAText = fight.athleteA
        ? getFullName(fight.athleteA)
        : fight.startNumberA || '';
      const athleteAWeight = fight.athleteA?.category
        ? ` (${fight.athleteA.category})`
        : '';
      this.doc.text(
        athleteAText + athleteAWeight,
        colX.athleteA,
        y + 4,
        { width: colW.athlete, ellipsis: true },
      );

      // Athlete B
      const athleteBText = fight.athleteB
        ? getFullName(fight.athleteB)
        : fight.startNumberB || '';
      const athleteBWeight = fight.athleteB?.category
        ? ` (${fight.athleteB.category})`
        : '';
      this.doc.text(
        athleteBText + athleteBWeight,
        colX.athleteB,
        y + 4,
        { width: colW.athlete, ellipsis: true },
      );

      // Result
      if (fight.result) {
        const resultText = this.doc.formatPoints(fight.result);
        this.doc.text(resultText, colX.result, y + 4, {
          width: colW.result,
          align: 'center',
        });
      } else {
        // Empty field for not yet generated fights
        this.doc
          .rect(colX.result + 5, y + 2, colW.result - 10, rowHeight - 6)
          .lineWidth(0.5)
          .stroke('#cccccc');
      }

      y += rowHeight;
    }

    // Bottom line
    this.doc.addHr(y - 4, '#000000', 0.5);

    return y;
  }

  protected getDocumentTitle(): string {
    return 'Japanisches Turnier';
  }
}
