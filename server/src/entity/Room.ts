import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  participants: string;

  @Column()
  has_started: boolean;

  @Column()
  room_name: string;
}
