import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique,
  OneToMany,
} from 'typeorm';
import { Board } from '../boards/boards.entity';

@Entity()
@Unique(['username'])
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Board, (board) => board.user, { eager: true })
  boards: Board[];
}
