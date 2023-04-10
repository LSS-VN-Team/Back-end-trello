import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageController } from './image.controller';
import { ImageSchema, Img } from './image.schema';
import { ImageService } from './image.service';
import { UpLoadController } from '../upload/upLoad.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Img.name,
        schema: ImageSchema,
      },
    ]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
