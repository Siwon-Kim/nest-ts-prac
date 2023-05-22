import {
  Controller,
  HttpException,
  Get,
  UseFilters,
  Param,
  Req,
  Body,
  Post,
  Put,
  Delete,
  Patch,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from '../commons/exceptions/http-exception.filter';
import { PositiveIntPipe } from 'src/commons/pipes/positiveInt.pipe';
import { SuccessInterceptor } from 'src/commons/interceptors/success.interceptor';
import { CatRequestDto } from './dto/cats.request.dto';
import { CatReadOnlyDto } from './dto/cats.response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/commons/decorators/user.decorator';
import { Cat } from './cats.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/commons/utils/multer.options';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 고양이 정보' })
  @UseGuards(JwtAuthGuard) // auth-middleware 대체
  @Get()
  // @Req req: Request 사용하지 않고 더 추상화시킴 (@CurrentUser에서 req.user를 가져옴)
  getCurrentCat(@CurrentUser() cat: Cat) {
    return cat.readOnlyData;
  }

  @ApiOperation({ summary: '모든 고양이 정보 조회' })
  @Get('all')
  getAllCats() {
    return this.catsService.getAllCats();
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
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '고양이 사진 업로드' })
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats')))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadCatImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() cat: Cat,
  ) {
    console.log('files: ', files);
    return this.catsService.uploadCatImg(files, cat);
  }
}
