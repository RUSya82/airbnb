import {ScheduleService} from './schedule.service';
import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post} from '@nestjs/common';
import {CreateScheduleDto} from './dto/create-schedule.dto';
import {ROOM_IS_BOOKED, SCHEDULE_NOT_FOUND} from './schedule-constants';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import {FindRoomDto} from '../room/dto/find-room.dto';
import {FindScheduleDto} from './dto/find-schedule.dto';

@Controller('schedule')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Post('create')
    async create(@Body() dto: CreateScheduleDto) {
        const {roomId, dateFrom, dateTo} = dto;
        const res = await this.scheduleService.bookingsByRoomByDates(roomId, dateFrom, dateTo);
        console.log( res);
        if (res.length > 0) {
            throw new HttpException(ROOM_IS_BOOKED, HttpStatus.CONFLICT);
        }
        return this.scheduleService.create(dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const deletedDocument = await this.scheduleService.delete(id);
        if (!deletedDocument) {
            throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return deletedDocument;
    }

    @Get('getAll/:limit?')
    async getAll(@Body() conditions: FindScheduleDto, @Param('limit') limit) {
        return this.scheduleService.getAll(conditions, limit);
    }


    @Patch(':scheduleId')
    async update(@Param('scheduleId') scheduleId: string, @Body() updateDto: UpdateScheduleDto) {
        const updateDoc = await this.scheduleService.update(scheduleId, updateDto);
        if (!updateDoc) {
            throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return updateDoc;
    }

}
