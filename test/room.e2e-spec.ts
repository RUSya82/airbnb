import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {CreateRoomDto} from '../src/room/dto/create-room.dto';
import {RoomTypes} from '../src/room/room.model/room.model';
import {disconnect, Types} from 'mongoose';
import {ROOM_NOT_FOUND} from '../src/room/room-constants';

const roomId = new Types.ObjectId().toHexString();

const testDto: CreateRoomDto = {
    roomNumber: '326',
    roomFloor: 5,
    roomType: RoomTypes.lux,
    seaView: false,
    hasBalcony: true,
};
const testDtoUpdate: CreateRoomDto = {
    roomNumber: '478',
    roomFloor: 15,
    roomType: RoomTypes.standard,
    seaView: true,
    hasBalcony: true,
};

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

    it('/room/create (POST) - success', async () => {
        let {body}: request.Response = await request(app.getHttpServer()).post('/room/create').send(testDto).expect(201);
        createdId = body._id;
        expect(createdId).toBeDefined();
    });

    //Я так понимаю, что этот тест можно будет после валидации запускать
    // it('/room/create (POST) - failed', async () => {
    //     let {body}: request.Response = await request(app.getHttpServer())
    //         .post('/room/create')
    //         .send(null)
    //         .expect(400)
    // });

    /**** test FIND BY ID room ****/
    it('/room/findById/:roomId (GET) - success', async () => {
        return request(app.getHttpServer())
            .get('/room/findById/' + createdId)
            .expect(200)
            .then(({body}: request.Response) => {
                expect(body).toBeDefined();
            });
    });
    it('/room/findById/:roomId (GET) - failed', async () => {
        return request(app.getHttpServer())
            .get('/room/findById/' + new Types.ObjectId().toHexString())
            .expect(200, {});
    });

    /**** test GET All room ****/
    it('/room/getAll - success', async () => {
        return request(app.getHttpServer())
            .get('/room/getAll/')
            .expect(200)
            .send({roomType: RoomTypes.lux})
            .then(({body}: request.Response) => {
                expect(body.length).toBeGreaterThan(0);
            });
    });
    it('/room/getAll - failed', async () => {
        return request(app.getHttpServer())
            .get('/room/getAll/')
            .expect(200)
            .send({roomFloor: 166262})
            .then(({body}: request.Response) => {
                expect(body.length).toBe(0);
            });
    });

    /**** test UPDATE room ****/
    it('/room/:id (POST) - success', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .patch('/room/' + createdId)
            .send(testDtoUpdate)
            .expect(200);
        expect(body._id).toBeDefined();
    });
    it('/room/:id (POST) - failed', async () => {
        let {body}: request.Response = await request(app.getHttpServer())
            .patch('/room/' + new Types.ObjectId().toHexString())
            .send(testDtoUpdate)
            .expect(404, {
                statusCode: 404,
                message: ROOM_NOT_FOUND,
            });
    });

    /**** test DELETE room ****/
    it('/room/:id (DELETE) - success', () => {
        return request(app.getHttpServer())
            .delete('/room/' + createdId)
            .expect(200);
    });
    it('/room/:id (DELETE) - failed', () => {
        return request(app.getHttpServer())
            .delete('/room/' + new Types.ObjectId().toHexString())
            .expect(404, {
                statusCode: 404,
                message: ROOM_NOT_FOUND,
            });
    });

    afterAll(() => {
        disconnect();
    });
});
