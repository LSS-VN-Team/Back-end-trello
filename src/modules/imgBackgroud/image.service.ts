import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Img, ImageDocument } from './image.schema';
import { UpLoadModule } from '../upload/upload.module';
import { async } from 'rxjs';
import { ImageDto } from './dtos/image.dto';
@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Img.name) private imageModel: Model<ImageDocument>,
    private uploadModel: Model<UpLoadModule>,
  ) {}

  async createImage(data: ImageDto) {
    const image = new this.uploadModel(data);
    const newImage = await image.save();
    return newImage;
  }
}
