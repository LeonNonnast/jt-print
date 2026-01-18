import { faker } from '@faker-js/faker';
import { DocumentInfo } from './document-info.type';

export function createRandomDocumentInfo(): DocumentInfo {
  return {
    tournamentName: faker.random.word(),
    language: faker.helpers.arrayElement([faker.locales.en, faker.locales.de])
      .title,
  } as DocumentInfo;
}

export const documentInfo: DocumentInfo = createRandomDocumentInfo();

describe('test document info type', () => {
  it('should create document info', () => {
    expect(createRandomDocumentInfo()).not.toBeNull();
  });
});
