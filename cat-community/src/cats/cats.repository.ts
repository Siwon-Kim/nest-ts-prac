import { Model, Types } from 'mongoose';
import { Cat } from './cats.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';
import { Comments } from 'src/comments/comments.schema';

@Injectable()
export class CatsRepository {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<Cat>,
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
  ) {}

  async findAll() {
    try {
      const result = await this.catModel
        .find()
        .populate({ path: 'comments', model: this.commentsModel }); // foreign key에 해당하는 virtual field인 commentsList를 populate
      console.log('result', result);
      return result;
    } catch (error) {
      throw new HttpException('DB Error', 500);
    }
  }

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

  async findCatByIdWithoutPassword(
    catId: string | Types.ObjectId,
  ): Promise<Cat | null> {
    try {
      return await this.catModel.findById(catId).select('-password'); // password field 제외하고 나머지 field return
    } catch (error) {
      throw new HttpException('DB Error', 500);
    }
  }

  async findByIdAndUpdateImg(catId: string, fileName: string) {
    try {
      const cat = await this.catModel.findById(catId);
      cat.imgUrl = `http://localhost:8000/static/${fileName}`;
      const newCat = await cat.save();
      return newCat.readOnlyData;
    } catch (error) {
      throw new HttpException('DB Error', 500);
    }
  }
}
