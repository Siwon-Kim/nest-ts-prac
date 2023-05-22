import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsRepository } from './boards.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './boards.entity';
import { Users } from '../auth/users.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardsRepository)
    private boardsRepository: BoardsRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardsRepository.find();
  }

  async getAllMyBoards(user: Users): Promise<Board[]> {
    const query = this.boardsRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();
    return boards;
  }

  createBoard(createBoardDto: CreateBoardDto, user: Users): Promise<Board> {
    return this.boardsRepository.createBoard(createBoardDto, user);
  }

  async getBoardById(id: number): Promise<Board> {
    const boardFound = await this.boardsRepository.findOne({ where: { id } });
    // 404 에러 처리
    if (!boardFound) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return boardFound;
  }

  async deleteBoardById(id: number, user: Users): Promise<void> {
    // delete: no 404 vs. remove: 404
    const result = await this.boardsRepository
      .createQueryBuilder('board')
      .delete()
      .from(Board)
      .where('id = :id AND user = :user', { id, user })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const boardFound = await this.getBoardById(id);
    boardFound.status = status;
    await this.boardsRepository.save(boardFound);
    return boardFound;
  }
}
