import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class AutomaticRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;

  @Column()
  has_started: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
