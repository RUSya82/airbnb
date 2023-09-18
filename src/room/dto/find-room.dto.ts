import {RoomTypes} from '../room.model/room.model';

export class FindRoomDto {
    roomNumber?: string;
    roomFloor?: number;
    roomType?: RoomTypes;
    seaView?: boolean;
    hasBalcony?: boolean;
}