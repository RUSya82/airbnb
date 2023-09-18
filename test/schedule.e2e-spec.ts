import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {disconnect, Types} from 'mongoose';
import {CreateScheduleDto} from '../src/schedule/dto/create-schedule.dto';
import {ROOM_IS_BOOKED, SCHEDULE_NOT_FOUND} from '../src/schedule/schedule-constants';
import {UpdateScheduleDto} from '../src/schedule/dto/update-schedule.dto';

const roomId = new Types.ObjectId().toHexString();

const testDto: CreateScheduleDto = {
    roomId,
    dateFrom: '2023-11-28',
    dateTo: '2023-12-30',
};
const testDtoUpdate: UpdateScheduleDto = {
    roomId,
    dataFrom: '2023-11-28',
    dataTo: '2023-12-15',
};
const dates = ['2023-11-25', '2023-11-29', '2023-12-02', '2023-12-31']

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/schedule/create (POST) - success', async () => {
        let {body}: request.Response = await request(app.getHttpServer()).post('/schedule/create').send(testDto).expect(201);
        createdId = body._id;
        expect(createdId).toBeDefined();
    });
    it('/schedule/create (POST) - fail ROOM_CREATED (case dateFrom$gt & dateTo$lt', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .post('/schedule/create')
            .send({...testDto, dateFrom: dates[1], dateTo: dates[2]})
            .expect(409, {
            statusCode: 409,
            message: ROOM_IS_BOOKED,
        });
    });
    it('/schedule/create (POST) - fail ROOM_CREATED (case dateFrom$lt & dateTo$lt', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .post('/schedule/create')
            .send({...testDto, dateFrom: dates[0], dateTo: dates[2]})
            .expect(409, {
                statusCode: 409,
                message: ROOM_IS_BOOKED,
            });
    });
    it('/schedule/create (POST) - fail ROOM_CREATED (case dateFrom$gt & dateTo$gt', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .post('/schedule/create')
            .send({...testDto, dateFrom: dates[2], dateTo: dates[3]})
            .expect(409, {
                statusCode: 409,
                message: ROOM_IS_BOOKED,
            });
    });
    it('/schedule/create (POST) - fail ROOM_CREATED (case dateFrom$lt & dateTo$gt', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .post('/schedule/create')
            .send({...testDto, dateFrom: dates[0], dateTo: dates[3]})
            .expect(409, {
                statusCode: 409,
                message: ROOM_IS_BOOKED,
            });
    });

    /**** test GET All room ****/
    it('/schedule/getAll - success', async () => {
        return request(app.getHttpServer())
            .get('/schedule/getAll/')
            .expect(200)
            .send({roomId})
            .then(({body}: request.Response) => {
                expect(body.length).toBeGreaterThan(0);
            });
    });

    /**** test UPDATE room ****/
    it('/schedule/:id (PATCH) - success', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .patch('/schedule/' + createdId)
            .send(testDtoUpdate)
            .expect(200);
        expect(body._id).toBeDefined();
    });
    it('/schedule/:id (PATCH) - failed', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .patch('/schedule/' + new Types.ObjectId().toHexString())
            .send(testDtoUpdate)
            .expect(404, {
                statusCode: 404,
                message: SCHEDULE_NOT_FOUND,
            });
    });


    /**** test DELETE room ****/
    it('/schedule/:id (DELETE) - success', () => {
        return request(app.getHttpServer())
          .delete('/schedule/' + createdId)
          .expect(200);
    });
    it('/schedule/:id (DELETE) - failed', () => {
        return request(app.getHttpServer())
          .delete('/schedule/' + createdId)
          .expect(404, {
              statusCode: 404,
              message: SCHEDULE_NOT_FOUND
          });
    });

    afterAll(() => {
        disconnect();
    });
});
