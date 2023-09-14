import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {RoomDocument, RoomModel} from './room.model/room.model';
import {Model, Types} from 'mongoose';
import {CreateRoomDto} from './dto/create-room.dto';
import {UpdateRoomDto} from './dto/update-room.dto';
import {FindRoomDto} from './dto/find-room.dto';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class RoomService {
    constructor(@InjectModel(RoomModel.name) private roomModel: Model<RoomDocument>, configService: ConfigService) {}


    async createRoom(dto: CreateRoomDto): Promise<RoomModel> {
        return this.roomModel.create(dto);
    }

    async delete(roomId: string): Promise<RoomModel | null> {
        return this.roomModel.findByIdAndDelete(roomId).exec();
    }

    async findRoomById(roomId: string): Promise<RoomModel | null> {
        return this.roomModel.findById(roomId).exec();
    }

    async update(roomId: string, updateData: UpdateRoomDto): Promise<RoomModel | null> {
        return this.roomModel
            .findByIdAndUpdate(new Types.ObjectId(roomId), updateData, {
                returnDocument: 'after',
                lean: true,
            })
            .exec();
    }

    async getAll(conditions: FindRoomDto, limit = 100): Promise<RoomModel[]> {
        return this.roomModel.find(conditions).limit(limit).exec();
    }
}
