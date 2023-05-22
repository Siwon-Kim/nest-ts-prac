import {
  Controller,
  HttpException,
  Get,
  UseFilters,
  Param,
  Post,
  Put,
  Delete,
  Patch,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from '../commons/exceptions/http-exception.filter';
import { PositiveIntPipe } from 'src/commons/pipes/positiveInt.pipe';
import { SuccessInterceptor } from 'src/commons/interceptors/success.interceptor';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getAllCats() {
    throw new HttpException('get api broken', 401);
  }

  @Get('/:id')
  getOneCat(@Param('id', ParseIntPipe, PositiveIntPipe) param: number) {
    return 'get one cat';
  }
}
