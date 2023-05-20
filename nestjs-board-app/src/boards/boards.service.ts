import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsRepository } from './boards.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './boards.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardsRepository)
    private boardsRepository: BoardsRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardsRepository.find();
  }

  createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsRepository.createBoard(createBoardDto);
  }

  async getBoardById(id: number): Promise<Board> {
    const boardFound = await this.boardsRepository.findOne({ where: { id } });
    // 404 에러 처리
    if (!boardFound) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return boardFound;
  }

  async deleteBoardById(id: number): Promise<void> {
    // delete: no 404 vs. remove: 404
    const result = await this.boardsRepository.delete(id);

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
