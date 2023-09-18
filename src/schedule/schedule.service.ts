import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {ScheduleDocument, ScheduleModel} from './schedule.model/schedule.model';
import {CreateScheduleDto} from './dto/create-schedule.dto';
import {UpdateScheduleDto} from './dto/update-schedule.dto';
import {FindScheduleDto} from './dto/find-schedule.dto';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class ScheduleService {
    constructor(
        @InjectModel(ScheduleModel.name) private scheduleModel: Model<ScheduleDocument>,
        private configService: ConfigService
    ) {}

    async create(dto: CreateScheduleDto): Promise<ScheduleModel> {
        return this.scheduleModel.create(dto);
    }

    async delete(id: string): Promise<ScheduleModel | null> {
        return this.scheduleModel.findByIdAndDelete(new Types.ObjectId(id));
    }

    async update(scheduleId: string, dto: UpdateScheduleDto): Promise<ScheduleModel | null> {
        return this.scheduleModel
            .findByIdAndUpdate(new Types.ObjectId(scheduleId), dto, {
                returnDocument: 'after',
                lean: true,
            })
            .exec();
    }

    async getAll(conditions: FindScheduleDto, limit = this.configService.get('MAX_FIND_LIMIT')): Promise<ScheduleModel[]> {
        return this.scheduleModel.find(conditions).limit(limit).exec();
    }

    async bookingsByRoomByDates(roomId: string, from: string, to: string): Promise<ScheduleModel[]> {
        const conditions = {
            roomId: new Types.ObjectId(roomId),
            $or: [
                {
                    $or: [
                        {
                            dateFrom: {$gte: from, $lte: to},
                        },
                        {
                            dateTo: {$gte: from, $lte: to},
                        },
                    ],
                },
                {
                    $and: [{dateFrom: {$lte: from}}, {dateTo: {$gte: to}}],
                },
            ],
        };
        return this.scheduleModel.find(conditions).exec();
    }

}
