import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post} from '@nestjs/common';
import {RoomService} from './room.service';
import {CreateRoomDto} from './dto/create-room.dto';
import {ROOM_NOT_FOUND} from './room-constants';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post('create')
    async create(@Body() dto: CreateRoomDto) {
        return this.roomService.createRoom(dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const deletedDocument = await this.roomService.delete(id);
        if (!deletedDocument) {
            throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return deletedDocument;
    }

    @Get('getAll')
    async getAll() {
        return this.roomService.getAll();
    }

    @Get('findById/:roomId')
    async findById(@Param('roomId') roomId: string) {
        return this.roomService.findRoomById(roomId);
    }

    @Patch(':roomId')
    async updateRoom(@Param('roomId') roomId: string, @Body() updateData: UpdateRoomDto) {
        const updateDoc = await this.roomService.update(roomId, updateData);
        if (!updateDoc) {
            throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return updateDoc;
    }
}
