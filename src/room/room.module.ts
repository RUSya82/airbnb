import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import {MongooseModule} from "@nestjs/mongoose";
import {RoomModel, RoomSchema} from "./room.model/room.model";

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [
    MongooseModule.forFeature([
      {
        name: RoomModel.name,
        schema: RoomSchema
      },
    ])
  ]
})
export class RoomModule {}
