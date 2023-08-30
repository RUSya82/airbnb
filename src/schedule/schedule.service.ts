import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ScheduleDocument, ScheduleModel} from "./schedule.model/schedule.model";

@Injectable()
export class ScheduleService {
    constructor(
        @InjectModel(ScheduleModel.name) private roomModel: Model<ScheduleDocument>
    ) {}


}
