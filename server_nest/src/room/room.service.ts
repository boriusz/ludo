import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './room.entity';
import { Repository } from 'typeorm';
import { SessionData } from 'express-session';
import { UserSessionData } from '../main';
import {
  Color,
  PLAYER_COLORS,
  RoomPlayersData,
  RoomRO,
} from './room.interface';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>
  ) {}

  async find(): Promise<RoomEntity[]> {
    return await this.roomRepository.find();
  }

  async findOne(roomId: number): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({ id: roomId });
    if (!room) return null;
    return room;
  }

  async saveRoom(data: RoomEntity): Promise<RoomEntity> {
    return await this.roomRepository.save(data);
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
      (room.players.length > 1 &&
        room.players.every(
          (player: RoomPlayersData) => player.isReady === true
        ))
    ) {
      room.hasStarted = true;
      await this.start(roomId);
      return true;
    }
    return false;
  }

  checkIfUserInGame(session: SessionData): boolean {
    let inGame, roomId;
    if (session.user) {
      inGame = session.user.inGame;
      roomId = session.user.roomId;
    }
    return !!(inGame && roomId);
  }

  async findRoomWithPlaceForNextUser(): Promise<RoomEntity | false> {
    const roomList = await this.find();
    for (const room of roomList) {
      const { players, hasStarted } = room;
      if (players.length < 4 && !hasStarted) return room;
    }
    return false;
  }

  async joinRoom(
    roomId: number,
    userCreds: { name: string; userId: string },
    session: SessionData
  ): Promise<RoomEntity> {
    const room = await this.findOne(roomId);
    const { name, userId } = userCreds;
    const takenColors = room.players.map(
      (player: RoomPlayersData) => player.color
    );
    let color: Color = PLAYER_COLORS[Math.floor(Math.random() * 4)] as Color;
    while (takenColors.find((element: Color) => element === color))
      color = PLAYER_COLORS[Math.floor(Math.random() * 4)] as Color;
    room.players.push({
      color,
      userId,
      isReady: false,
      name,
    });
    const savedRoom = await this.saveRoom(room);
    session.user.roomId = savedRoom.id;
    session.user.inGame = true;
    return savedRoom;
  }

  async createRoom(): Promise<RoomEntity> {
    const room = new RoomEntity();
    room.hasStarted = false;
    room.players = [];
    return await this.saveRoom(room);
  }

  async switchReady(
    isReady: string,
    user: UserSessionData
  ): Promise<RoomEntity> {
    const { roomId, userId } = user;
    const room = await this.findOne(roomId);
    if (room) {
      const player = room.players.find(
        (player: RoomPlayersData) => player.userId === userId
      );
      player.isReady = isReady === 'true';
      const canStart = await this.checkIfCanStart(roomId);
      if (canStart) await this.start(roomId);

      return await this.saveRoom(room);
    }
  }
}
