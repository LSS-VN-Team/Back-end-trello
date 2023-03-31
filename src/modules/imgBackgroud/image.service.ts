import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './image.schema';
@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async findAll(): Promise<Image[]> {
    return this.imageModel.find().exec();
  }

  async findOne(id: string): Promise<Image> {
    return this.imageModel.findById(id).exec();
  }

  async findById(id: string): Promise<Image> {
    return this.imageModel.findById(id).exec();
  }
}
