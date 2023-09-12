import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {RoomDocument, RoomModel} from './room.model/room.model';
import {Model, Types} from 'mongoose';
import {CreateRoomDto} from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
    constructor(@InjectModel(RoomModel.name) private roomModel: Model<RoomDocument>) {}

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
    async getAll(): Promise<RoomModel[]> {
        return this.roomModel.find({}).exec();
    }
}
