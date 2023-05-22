import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from 'src/cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly catsRepository: CatsRepository,
    private jwtService: JwtService, // DI: authModule에 정의돼 있음
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    const { email, password } = data;

    // email 존재 여부
    const cat = await this.catsRepository.findCatByEmail(email);
    if (!cat) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    // password 일치 여부
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      cat.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    // jwt 생성
    const payload = { email: cat.email, sub: cat._id }; // sub: 토큰 제목

    return {
      token: this.jwtService.sign(payload), // generating token
    };
  }
}
