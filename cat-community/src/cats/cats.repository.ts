import { Model } from 'mongoose';
import { Cat } from './cats.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async checkExistingEmail(email: string): Promise<boolean> {
    try {
      const result = await this.catModel.exists({ email });
      return !!result;
    } catch (error) {
      throw new HttpException('DB Error', 500);
    }
  }

  async createCatAccount(cat: CatRequestDto): Promise<Cat> {
    try {
      return await this.catModel.create(cat);
    } catch (error) {
      throw new HttpException('DB Error', 500);
    }
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    try {
      return await this.catModel.findOne({ email });
    } catch (error) {
      throw new HttpException('DB Error', 500);
    }
  }

  async findCatByIdWithoutPassword(catId: string): Promise<Cat | null> {
    try {
      return await this.catModel.findById(catId).select('-password'); // password field 제외하고 나머지 field return
    } catch (error) {
      throw new HttpException('DB Error', 500);
    }
  }
}