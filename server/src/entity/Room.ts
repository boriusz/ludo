import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;

  @Column()
  has_started: boolean;

  @Column()
  room_name: string;

  @Column()
  owner: string;

  @Column()
  ownerID: string;

  @Column({ nullable: true, type: "timestamp" })
  time_to_begin: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
