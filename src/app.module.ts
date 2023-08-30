import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ScheduleModule} from './schedule/schedule.module';
import {RoomModule} from './room/room.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { getMongoConfig } from "./configs/mongo.config";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        // MongooseModule.forRoot('admin:admin@mongodb://localhost/mongo?authSource=admin'),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMongoConfig
        }),
        ScheduleModule,
        RoomModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
