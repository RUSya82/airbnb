import {Module} from '@nestjs/common';
import {ScheduleController} from './schedule.controller';
import {ScheduleService} from './schedule.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ScheduleModel, ScheduleSchema} from './schedule.model/schedule.model';
import {RoomModel, RoomSchema} from '../room/room.model/room.model';

@Module({
    controllers: [ScheduleController],
    providers: [ScheduleService],
    imports: [
        MongooseModule.forFeature([
            {
                name: ScheduleModel.name,
                schema: ScheduleSchema,
            },
            {
                name: RoomModel.name,
                schema: RoomSchema,
            },
        ]),
    ],
})
export class ScheduleModule {}
