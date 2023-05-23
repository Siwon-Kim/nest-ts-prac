import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsCreateDto } from './dto/comments.create.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getAllComments() {
    return await this.commentsService.getAllComments();
  }

  @Post(':id')
  async createComment(
    @Param('id') id: string,
    @Body() body: CommentsCreateDto,
  ) {
    return await this.commentsService.createComment(id, body);
  }

  @Patch(':id')
  async incrementLikes(@Param('id') id: string) {
    return await this.commentsService.incrementLikes(id);
  }
}
