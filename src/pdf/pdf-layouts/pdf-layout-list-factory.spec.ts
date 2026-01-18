import { PDFLayoutListFactory } from './pdf-layout-list-factory';
import { Systems } from '../../types/systems.enum';
import { DocumentInfo } from '../../types/document-info.type';
import { Competition } from '../../types/competition.type';
import { LayoutNotFoundWithSystem } from '../../types/layout-not-found-with-system.exception';
import { LayoutNotFoundWithSize } from '../../types/layout-not-found-with-size.exception';
import { createRandomCompetitions } from '../../types/competition.type.spec';
import { createRandomDocumentInfo } from '../../types/document-info.type.spec';
import { PDFLayoutListPoolBestOfThreeSize2 } from './pdf-layout-list-pool-best-of-three-size-2';
import { PDFLayoutListPoolDeathMatchSize2 } from './pdf-layout-list-pool-death-match-size-2';
import { PDFLayoutListPoolDeathMatchSize3 } from './pdf-layout-list-pool-death-match-size-3';
import { PDFLayoutListPoolDeathMatchSize4 } from './pdf-layout-list-pool-death-match-size-4';
import { PDFLayoutListPoolDeathMatchSize5 } from './pdf-layout-list-pool-death-match-size-5';
import { PDFLayoutListPoolDeathMatchSize6 } from './pdf-layout-list-pool-death-match-size-6';
import { PDFLayoutListPoolDeathMatchSize7 } from './pdf-layout-list-pool-death-match-size-7';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize128 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-128';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize8 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-8';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize64 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-64';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize32 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-32';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize16 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-16';

describe('Pdf Layout List Factory', () => {
  const documentInfo = createRandomDocumentInfo();

  describe('test exceptions', () => {
    it('should throw layout not found with system exception', () => {
      expect(() =>
        when(undefined as Systems, {} as DocumentInfo, [] as Competition[]),
      ).toThrow(new LayoutNotFoundWithSystem(undefined).message);
    });

    it.each<any>([
      {
        system: Systems.BestOfThree,
        athleteCount: 1,
      },
      {
        system: Systems.BestOfThree,
        athleteCount: 3,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 1,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 2,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 8,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 7,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 129,
      },
    ])(
      'should throw layout not found with size exception ($system $athleteCount)',
      ({ system, athleteCount }) => {
        // const athletes = createRandomAthletes(athleteCount);

        expect(() => when(system, documentInfo, [])).toThrow(
          new LayoutNotFoundWithSize(athleteCount).message,
        );
      },
    );
  });

  describe('test factory build right instance', () => {
    it.each<any>([
      {
        system: Systems.BestOfThree,
        athleteCount: 2,
        expectedLayout: PDFLayoutListPoolBestOfThreeSize2,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 2,
        expectedLayout: PDFLayoutListPoolDeathMatchSize2,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 3,
        expectedLayout: PDFLayoutListPoolDeathMatchSize3,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 4,
        expectedLayout: PDFLayoutListPoolDeathMatchSize4,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 5,
        expectedLayout: PDFLayoutListPoolDeathMatchSize5,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 6,
        expectedLayout: PDFLayoutListPoolDeathMatchSize6,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 7,
        expectedLayout: PDFLayoutListPoolDeathMatchSize7,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 8,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize8,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 9,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize16,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 16,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize16,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 17,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize32,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 32,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize32,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 33,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize64,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 64,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize64,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 65,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize128,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 128,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize128,
      },
    ])(
      'test $system with athlete count $athleteCount',
      ({ system, athleteCount, expectedLayout }) => {
        // const athletes = createRandomAthletes(athleteCount);
        const actual = when(system, documentInfo, []);

        expect(actual).toBeInstanceOf(expectedLayout);
      },
    );
  });

  describe('test factory provide right information to set list-info', () => {
    test.each<any>([
      {
        system: Systems.BestOfThree,
        athleteCount: 2,
        expectedLayout: PDFLayoutListPoolBestOfThreeSize2,
      },

      {
        system: Systems.JederGegenJeden,
        athleteCount: 3,
        expectedLayout: PDFLayoutListPoolDeathMatchSize3,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 4,
        expectedLayout: PDFLayoutListPoolDeathMatchSize4,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 5,
        expectedLayout: PDFLayoutListPoolDeathMatchSize5,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 6,
        expectedLayout: PDFLayoutListPoolDeathMatchSize6,
      },
      {
        system: Systems.JederGegenJeden,
        athleteCount: 7,
        expectedLayout: PDFLayoutListPoolDeathMatchSize7,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 8,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize8,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 9,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize16,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 16,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize16,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 17,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize32,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 32,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize32,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 33,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize64,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 64,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize64,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 65,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize128,
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        athleteCount: 128,
        expectedLayout: PDFLayoutListTreeKoSystemWithDoubleRepechageSize128,
      },
    ])(
      'test list info is correct: $athleteCount $system',
      ({ system, athleteCount, expectedLayout }) => {
        // const athletes = createRandomAthletes(athleteCount);
        const competitions = createRandomCompetitions(athleteCount);
        const actual = when(system, documentInfo, competitions);
        expect(actual).toBeInstanceOf(expectedLayout);
      },
    );
  });
});

function when(
  system: Systems,
  documentInfo: DocumentInfo,
  competitions: Competition[],
) {
  return PDFLayoutListFactory.build(
    { system, category: 'M | U18 | -66', size: 10, athleteCount: 30 },
    documentInfo,
    competitions,
  );
}
