import {RoomTypes} from '../room.model/room.model';

export class UpdateRoomDto {
  roomNumber: string;
  roomType: RoomTypes;
  seaView?: boolean;
}