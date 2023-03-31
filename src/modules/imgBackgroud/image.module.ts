import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageController } from './image.controller';
import { ImageSchema } from './image.schema';
import { ImageService } from './image.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Image.name,
        schema: ImageSchema,
      },
    ]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
