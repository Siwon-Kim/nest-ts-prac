import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.model';
import { BoardStatus } from './boards.model';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  getAllBoards(): Board[] {
    return this.boards;
  }

  createBoard(createBoardDto: CreateBoardDto) {
    const { title, description } = createBoardDto;
    const board: Board = {
      id: uuid(),
      title,
      description,
      status: BoardStatus.PUBLIC,
    };

    this.boards.push(board);
    return board;
  }

  getBoardById(id: string): Board {
    const boardFound = this.boards.find((board) => board.id === id);
    // 404 에러 처리
    if (!boardFound) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return boardFound;
  }

  deleteBoardById(id: string): void {
    const boardFound = this.getBoardById(id);
    this.boards = this.boards.filter((board) => board.id !== boardFound.id);
  }

  updateBoardStatus(id: string, status: BoardStatus): Board {
    const boardFound = this.getBoardById(id);
    boardFound.status = status;
    return boardFound;
  }
}
