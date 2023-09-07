import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as MSchema, Types} from 'mongoose';
import {RoomModel} from '../../room/room.model/room.model';

export type ScheduleDocument = HydratedDocument<ScheduleModel>;

@Schema({timestamps: true})
export class ScheduleModel {
    @Prop()
    day: string;

    @Prop({type: MSchema.Types.ObjectId, ref: RoomModel.name})
    roomId: Types.ObjectId;
}

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel);
