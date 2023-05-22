import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './cats.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const existsCat = await this.catModel.exists({ email }); // email 중복 체크
    if (existsCat) {
      throw new UnauthorizedException('이미 존재하는 고양이입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // password 암호화
    const cat = await this.catModel.create({
      email,
      name,
      password: hashedPassword,
    });
    return cat.readOnlyData; // virtual로 정의된 field만 return
  }
}
