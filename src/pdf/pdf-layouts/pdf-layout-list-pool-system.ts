import { PDFLayoutList } from './pdf-layout-list';
import { Systems } from '../../types/systems.enum';
import { PDFComponentPoolSingle } from './pdf-component-pool-single-pool';
import { PDFComponentPoolSystemFinals } from './pdf-component-pool-system-finals';
import { Competition } from '../../types/competition.type';
import { DocumentInfo } from '../../types/document-info.type';
import { ListInfo } from '../../types/list-info.type';

export class PDFLayoutListPoolSystem extends PDFLayoutList {
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
  ): PDFLayoutListPoolSystem {
    return new PDFLayoutListPoolSystem(documentInfo, listInfo, competitions);
  }

  protected getListSystem(): Systems {
    // Works for both PoolSystem and PoolSystemWithThirdPlace
    // since the layout handles both dynamically
    return this.listInfo.system as Systems;
  }

  protected getListSize(): number {
    return this.listInfo.athleteCount || this.listInfo.size;
  }

  /**
   * Calculate total pages needed for compact layout.
   * Try to fit everything on 1 page; otherwise use 2 pages.
   */
  protected get totalPages(): number {
    return this.needsSecondPage ? 2 : 1;
  }

  /**
   * Estimate whether all content fits on a single A4 page.
   * Usable height after header: ~750pt (842 - 90 header)
   * NOTE: Must not instantiate PDF components here (doc not yet initialized).
   */
  private get needsSecondPage(): boolean {
    const usableHeight = 750;
    // Pool table height: (athleteCount + 1 header + 0.5 time row) * 30pt rowHeight
    const poolAAthleteCount = this.getPoolAthleteCount(this.poolACompetitions);
    const poolBAthleteCount = this.getPoolAthleteCount(this.poolBCompetitions);
    const poolAHeight = (poolAAthleteCount + 1.5) * 30;
    const poolBHeight = (poolBAthleteCount + 1.5) * 30;
    // Finals height: ~160 without 3rd place, ~250 with
    const finalsHeight = this.hasThirdPlaceFight ? 250 : 160;
    // Section label heights: "Pool A" label (18pt) + gap (25pt) + "Pool B" label (18pt) + gap (25pt) + finals offset (15pt)
    const labelAndGapHeight = 18 + 25 + 18 + 25 + 15;
    const totalHeight = poolAHeight + poolBHeight + finalsHeight + labelAndGapHeight;
    return totalHeight > usableHeight;
  }

  /**
   * Get competitions that belong to Pool A (poolNumber === 1)
   */
  private get poolACompetitions(): Competition[] {
    return this.competitions.filter(
      (c) => c.poolNumber === 1,
    );
  }

  /**
   * Get competitions that belong to Pool B (poolNumber === 2)
   */
  private get poolBCompetitions(): Competition[] {
    return this.competitions.filter(
      (c) => c.poolNumber === 2,
    );
  }

  /**
   * Get finale competitions (those without poolNumber)
   */
  private get finalCompetitions(): Competition[] {
    return this.competitions.filter(
      (c) =>
        c.poolNumber === undefined ||
        c.poolNumber === null,
    );
  }

  /**
   * Determine if there's a 3rd place fight.
   * The finale block has 4 fights if 3rd place is included, 3 otherwise.
   */
  private get hasThirdPlaceFight(): boolean {
    return this.finalCompetitions.length > 3;
  }

  private get poolAListInfo(): ListInfo {
    const poolAAthleteCount = this.getPoolAthleteCount(this.poolACompetitions);
    return {
      ...this.listInfo,
      athleteCount: poolAAthleteCount,
    } as ListInfo;
  }

  private get poolBListInfo(): ListInfo {
    const poolBAthleteCount = this.getPoolAthleteCount(this.poolBCompetitions);
    return {
      ...this.listInfo,
      athleteCount: poolBAthleteCount,
    } as ListInfo;
  }

  /**
   * Count unique athletes in a set of competitions
   */
  private getPoolAthleteCount(competitions: Competition[]): number {
    const athletes = new Set<string>();
    competitions.forEach((c) => {
      if (c.athleteA?.startNumber) athletes.add(c.athleteA.startNumber.toString());
      if (c.athleteB?.startNumber) athletes.add(c.athleteB.startNumber.toString());
    });
    return athletes.size;
  }

  protected get poolComponentA(): PDFComponentPoolSingle {
    return new PDFComponentPoolSingle(
      this.doc,
      this.poolACompetitions,
      this.poolAListInfo,
    );
  }

  protected get poolComponentB(): PDFComponentPoolSingle {
    return new PDFComponentPoolSingle(
      this.doc,
      this.poolBCompetitions,
      this.poolBListInfo,
    );
  }

  protected get finalsComponent(): PDFComponentPoolSystemFinals {
    return new PDFComponentPoolSystemFinals(
      this.doc,
      this.finalCompetitions,
      this.hasThirdPlaceFight,
    );
  }

  /**
   * Draw a section label (e.g. "Pool A", "Pool B", "Finals") at a given Y position.
   */
  private drawSectionLabel(label: string, y: number): void {
    this.doc.setFontBold();
    this.doc.fontSize(12);
    this.doc.text(label, 25, y, { align: 'left', width: 200 });
    this.doc.setFontNormal();
    this.doc.fontSize(10);
  }

  public async generate(): Promise<void> {
    const twoPages = this.needsSecondPage;

    // ---- Page 1: Pool A + Pool B (+ possibly Finals) ----
    this.setPageTitle(twoPages ? 'Pools' : 'Pool System');
    await this.doc.addPageAsync();

    const headerEndY = 90;
    const sectionGap = 25;
    const labelHeight = 18;

    // -- Pool A --
    this.drawSectionLabel('Pool A', headerEndY);
    const poolAStartY = headerEndY + labelHeight;
    const poolAEndY = await this.poolComponentA.draw({
      yStart: poolAStartY,
      skipAddPage: true,
    });

    // -- Pool B --
    const poolBLabelY = poolAEndY + sectionGap;
    this.drawSectionLabel('Pool B', poolBLabelY);
    const poolBStartY = poolBLabelY + labelHeight;
    const poolBEndY = await this.poolComponentB.draw({
      yStart: poolBStartY,
      skipAddPage: true,
    });

    if (twoPages) {
      // ---- Page 2: Finals ----
      this.setPageTitle('Finals');
      await this.doc.addPageAsync();
      const finalsY = headerEndY + 15; // small offset for "Halbfinale" label above
      await this.finalsComponent.draw(finalsY);
    } else {
      // ---- Still on Page 1: Finals below Pool B ----
      const finalsLabelY = poolBEndY + sectionGap;
      await this.finalsComponent.draw(finalsLabelY + 15);
    }
  }
}
