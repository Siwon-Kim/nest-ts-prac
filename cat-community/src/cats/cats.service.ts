import { CatsRepository } from './cats.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';
import * as bcrypt from 'bcrypt';
import { Cat } from './cats.schema';

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const existsCat = await this.catsRepository.checkExistingEmail(email);
    if (existsCat) {
      throw new UnauthorizedException('이미 존재하는 고양이입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // password 암호화

    const cat = await this.catsRepository.createCatAccount({
      email,
      name,
      password: hashedPassword,
    });
    return cat.readOnlyData; // virtual로 정의된 field만 return
  }

  async uploadCatImg(files: Express.Multer.File[], cat: Cat) {
    const fileName = `cats/${files[0].filename}`;

    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );
    return newCat;
  }
}
