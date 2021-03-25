import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './room.entity';
import { Repository } from 'typeorm';
import { RoomPlayersData, RoomRO } from './room.interface';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>
  ) {}

  async findOne(roomId: number): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({ id: roomId });
    if (!room) return null;
    return room;
  }

  async start(roomId: number): Promise<RoomEntity> {
    const room = await this.findOne(roomId);
    if (!room) return null;
    room.hasStarted = true;
    return await this.roomRepository.save(room);
  }

  async getResponseData(roomId: number): Promise<RoomRO> {
    const room = await this.findOne(roomId);
    if (!room) return null;
    const { players, hasStarted } = room;
    const mappedPlayers = players.map((player: RoomPlayersData) => {
      const { name, isReady, color } = player;
      return { name, isReady, color };
    });
    return { players: mappedPlayers, hasStarted };
  }

  async checkIfCanStart(roomId: number): Promise<boolean> {
    const room = await this.findOne(roomId);
    if (!room) return false;
    if (
      room.players.length === 4 ||
      room.players.every((player: RoomPlayersData) => player.isReady === true)
    ) {
      room.hasStarted = true;
      await this.start(roomId);
      return true;
    }
    return false;
  }
}
