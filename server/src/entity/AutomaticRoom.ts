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
  hasStarted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
