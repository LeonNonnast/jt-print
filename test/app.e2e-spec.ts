import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createRandomAthletes } from '../src/types/athlete.type.spec';
import { createRandomDocumentInfo } from '../src/types/document-info.type.spec';
import { Systems } from '../src/types/systems.enum';
import { createRandomCompetitions } from '../src/types/competition.type.spec';
import { createListInfo } from '../src/types/list-info.type.spec';

const documentInfo = createRandomDocumentInfo();
const responseHasPDF = (response: request.Response) => {
  expect(response).not.toBeNull();
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('x-api-key', process.env.NEST_API_KEY)
      .expect(200)
      .expect('Server is running!');
  });

  it('/ (GET) - Should throw 401 Unauthorized', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(401)
      .expect({ statusCode: 401, message: 'Unauthorized' });
  });

  describe('should throw invalid system', () => {
    const listInfo = createListInfo(undefined, 'M | U18 | -66', 0, 0);

    it('/pdf/lists (POST) - invalid system - undefined', () => {
      return request(app.getHttpServer())
        .post('/pdf/lists')
        .set('x-api-key', process.env.NEST_API_KEY)
        .send({ documentInfo, listInfo })
        .set('Accept', 'application/json')
        .expect(400)
        .expect((response: request.Response) =>
          expect(response.body.message).toEqual(
            'Layout does not exists with sytem: undefined',
          ),
        );
    });

    it('/pdf/lists (POST) - invalid system - InvalidSampleName', () => {
      return request(app.getHttpServer())
        .post('/pdf/lists')
        .set('x-api-key', process.env.NEST_API_KEY)
        .send({ documentInfo, listInfo: { system: 'InvalidSampleName' } })
        .set('Accept', 'application/json')
        .expect(400)
        .expect((response: request.Response) =>
          expect(response.body.message).toEqual(
            'Layout does not exists with sytem: InvalidSampleName',
          ),
        );
    });
  });

  describe.each<{ system: Systems; size: number }>([
    { system: Systems.KoSystemWithDoubleRepechage, size: 0 },
    { system: Systems.KoSystemWithDoubleRepechage, size: 1 },
    { system: Systems.KoSystemWithDoubleRepechage, size: 7 },
    { system: Systems.KoSystemWithDoubleRepechage, size: 129 },
    { system: Systems.JederGegenJeden, size: 0 },
    { system: Systems.JederGegenJeden, size: 1 },
    { system: Systems.JederGegenJeden, size: 2 },
    { system: Systems.JederGegenJeden, size: 3 },
    { system: Systems.JederGegenJeden, size: 4 },
    { system: Systems.JederGegenJeden, size: 5 },
    { system: Systems.JederGegenJeden, size: 6 },
    { system: Systems.BestOfThree, size: 0 },
    { system: Systems.BestOfThree, size: 1 },
    { system: Systems.BestOfThree, size: 3 },
    { system: Systems.BestOfThree, size: 4 },
  ])('should throw invalid athlete size', ({ system, size }) => {
    const listInfo = createListInfo(system, 'M | U18 | -66', size, size);

    it('/pdf/lists (POST) - ' + system + ' - ' + size, () => {
      return request(app.getHttpServer())
        .post('/pdf/lists')
        .set('x-api-key', process.env.NEST_API_KEY)
        .send({
          documentInfo,
          listInfo,
          athletes: createRandomAthletes(size),
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect((response: request.Response) =>
          expect(response.body.message).toEqual(
            'Layout not found with athlete size: ' + size,
          ),
        );
    });
  });

  describe('should has status code 200 and pdf response', () => {
    it('/pdf/athletes/category (POST)', () => {
      return request(app.getHttpServer())
        .post('/pdf/athletes/category')
        .set('x-api-key', process.env.NEST_API_KEY)
        .send({ documentInfo, athletes: createRandomAthletes(400) })
        .set('Accept', 'application/json')
        .expect(200)
        .expect(responseHasPDF);
    });

    it('/pdf/athletes/club (POST)', () => {
      return request(app.getHttpServer())
        .post('/pdf/athletes/club')
        .set('x-api-key', process.env.NEST_API_KEY)
        .send({ documentInfo, athletes: createRandomAthletes(400) })
        .set('Accept', 'application/json')
        .expect(200)
        .expect(responseHasPDF);
    });

    it('/pdf/athletes/category (POST)', () => {
      return request(app.getHttpServer())
        .post('/pdf/results/category')
        .set('x-api-key', process.env.NEST_API_KEY)
        .send({ documentInfo, athletes: createRandomAthletes(400) })
        .set('Accept', 'application/json')
        .expect(200)
        .expect(responseHasPDF);
    });

    it('/pdf/results/nation (POST)', () => {
      return request(app.getHttpServer())
        .post('/pdf/results/nation')
        .set('x-api-key', process.env.NEST_API_KEY)
        .send({ documentInfo, athletes: createRandomAthletes(400) })
        .set('Accept', 'application/json')
        .expect(200)
        .expect(responseHasPDF);
    });

    describe.each<{ system: Systems; sizes: number[] }>([
      {
        system: Systems.BestOfThree,
        sizes: [2], // 2
      },
      {
        system: Systems.JederGegenJeden,
        sizes: [3, 4, 5, 6], // 3 - 6
      },
      {
        system: Systems.KoSystemWithDoubleRepechage,
        sizes: Array.from({ length: 121 }, (_, i) => i + 8), // von 8 - 128
      },
    ])('test $system ', ({ system, sizes }) => {
      it.each(sizes)('/pdf/lists/ (POST) - with %i', (size) => {
        const listInfo = createListInfo(system, 'M | U18 | -66', size, size);

        return request(app.getHttpServer())
          .post('/pdf/lists')
          .set('x-api-key', process.env.NEST_API_KEY)
          .send({
            documentInfo,
            listInfo,
            athletes: createRandomAthletes(size),
            competitions: createRandomCompetitions(size),
          })
          .set('Accept', 'application/json')
          .expect(200)
          .expect(responseHasPDF);
      });
    });
  });
});
