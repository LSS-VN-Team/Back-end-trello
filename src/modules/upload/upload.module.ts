import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { UpLoadController } from './upLoad.controller';
import { Upload } from './upload.schema';
import { TaskSchema } from '../task/task.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Upload.name,
        schema: TaskSchema,
      },
    ]),
  ],

  controllers: [UpLoadController],
  providers: [],
})
export class UpLoadModule {}
