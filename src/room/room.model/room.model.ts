import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type RoomDocument = HydratedDocument<RoomModel>;

export enum RoomTypes  {
    standard = 'Standard',
    standard_plus = 'Standard+',
    lux = 'LUX',
    extra_lux = 'Extra LUX'
}

@Schema({timestamps: true})
export class RoomModel {
    @Prop()
    roomNumber: string;

    @Prop()
    roomFloor: number;

    @Prop()
    roomType: RoomTypes;

    @Prop()
    seaView?: boolean;

    @Prop()
    hasBalcony: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(RoomModel);