import {
  Controller,
  HttpException,
  Get,
  UseFilters,
  Param,
  Body,
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
import { CatRequestDto } from './dto/cats.request.dto';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getCurrentCat() {
    return 'current cat';
  }

  @Post('signup')
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @Post('login')
  logIn() {
    return 'log in';
  }

  @Post('logout')
  logOut() {
    return 'log out';
  }

  @Post('upload/cats')
  uploadCatImg() {
    return 'upload cat img';
  }
}
