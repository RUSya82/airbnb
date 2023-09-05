import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {disconnect, Schema, Types} from "mongoose";
import {CreateScheduleDto} from "../src/schedule/dto/create-schedule.dto";
import {ROOM_IS_BOOKED, SCHEDULE_NOT_FOUND} from "../src/schedule/constants";

const roomId =  new Types.ObjectId().toHexString();

const testDto: CreateScheduleDto = {
    roomId,
    day: "22023-11-28",
}
const testDtoUpdate: CreateScheduleDto = {
    roomId,
    day: "2023-08-29",
}

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
        let {body}: request.Response = await request(app.getHttpServer())
            .post('/schedule/create')
            .send(testDto)
            .expect(201)
        createdId = body._id;
        expect(createdId).toBeDefined();
    });
    it('/schedule/create (POST) - fail ROOM_CREATED', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .post('/schedule/create')
            .send(testDto)
            .expect(409, {
                statusCode: 409,
                message: ROOM_IS_BOOKED
            });
    });

    //
    /**** test FIND BY ID room ****/
    it('/schedule/findById/:roomId (GET) - success', async () => {
        return request(app.getHttpServer())
            .get('/schedule/findById/' + createdId)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body).toBeDefined();
            })
    });
    it('/schedule/findById/:roomId (GET) - failed', async () => {
        return request(app.getHttpServer())
            .get('/schedule/findById/'  + new Types.ObjectId().toHexString())
            .expect(200, {})
    });
    //
    // /**** test GET All room ****/
    it('/schedule/getAll - success', async () => {
        return request(app.getHttpServer())
            .get('/schedule/getAll/')
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBeGreaterThan(0);
            })
    });

    /**** test UPDATE room ****/
    it('/schedule/:id (PATCH) - success', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .patch('/schedule/' + createdId)
            .send(testDtoUpdate)
            .expect(200)
        expect(body._id).toBeDefined();
    });
    it('/schedule/:id (PATCH) - failed', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .patch('/schedule/' + new Types.ObjectId().toHexString())
            .send(testDtoUpdate)
            .expect(404, {
                statusCode: 404,
                message: SCHEDULE_NOT_FOUND
            });
    });
    it('/schedule/byRoom/:roomId (GET) - success', async () => {
        return request(app.getHttpServer())
            .get('/schedule/byRoom/' + roomId)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBeGreaterThan(0);
            })
    });
    it('/schedule/byRoom/:roomId (GET) - failed', async () => {
        return request(app.getHttpServer())
            .get('/schedule/byRoom/' + new Types.ObjectId().toHexString())
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBe(0);
            })
    });
    it('/schedule/findRoomByDate/ (GET) - success', async () => {
        return request(app.getHttpServer())
            .get('/schedule/findRoomByDate/')
            .send(testDtoUpdate)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body).toBeDefined();
            })
    });
    it('/schedule/findRoomByDate/ (GET) - failed', async () => {
        return request(app.getHttpServer())
            .get('/schedule/findRoomByDate/')
            .send(testDto)
            .expect(200, {})
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
    })
});
