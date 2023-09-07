import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {ScheduleDocument, ScheduleModel} from './schedule.model/schedule.model';
import {CreateScheduleDto} from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
    constructor(@InjectModel(ScheduleModel.name) private scheduleModel: Model<ScheduleDocument>) {}

    async create(dto: CreateScheduleDto): Promise<ScheduleModel> {
        return this.scheduleModel.create(dto);
    }

    async delete(id: string): Promise<ScheduleModel | null> {
        return this.scheduleModel.findByIdAndDelete(id);
    }

    async update(scheduleId: string, dto: CreateScheduleDto): Promise<ScheduleModel | null> {
        return this.scheduleModel
            .findByIdAndUpdate(new Types.ObjectId(scheduleId), dto, {
                returnDocument: 'after',
                lean: true,
            })
            .exec();
    }

    async findById(scheduleId: string): Promise<ScheduleModel | null> {
        return this.scheduleModel.findById(scheduleId).exec();
    }

    async getAll(): Promise<ScheduleModel[]> {
        return this.scheduleModel.find({}).exec();
    }

    async findByRoomID(roomId: string): Promise<ScheduleModel[]> {
        return this.scheduleModel.find({roomId: new Types.ObjectId(roomId)}).exec();
    }

    async findRoomByDate(dto: CreateScheduleDto): Promise<ScheduleModel | null> {
        return this.scheduleModel.findOne(dto).exec();
    }

    async getAllByDate(date: string): Promise<ScheduleModel[]> {
        return this.scheduleModel.find({day: date}).exec();
    }
}
