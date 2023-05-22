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
import { CatReadOnlyDto } from './dto/cats.response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @ApiOperation({ summary: '로그인된 고양이 정보' })
  @Get()
  getCurrentCat() {
    return 'current cat';
  }

  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공!',
    type: CatReadOnlyDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('signup')
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn() {
    return 'log in';
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut() {
    return 'log out';
  }

  @ApiOperation({ summary: '고양이 사진 업로드' })
  @Post('upload/cats')
  uploadCatImg() {
    return 'upload cat img';
  }
}
