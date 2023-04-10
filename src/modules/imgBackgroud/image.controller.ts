import { Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Img, ImageDocument } from './image.schema';
import { UpLoadModule } from '../upload/upload.module';
import { ImageDto } from './dtos/image.dto';
import { ImageService } from './image.service';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
// import { ImageService } from './image.service';
// import { ImageService } from './image.service';

@ApiTags('IMG')
@Controller('IMG')
export class ImageController {
  @InjectModel(Img.name)
  private readonly imageModel: Model<ImageDocument>;
  constructor(
    private readonly uploadModel: Model<UpLoadModule>,
    private readonly imageService: ImageService,
  ) {}
  private readonly logger = new Logger(ImageController.name);

  @ApiOperation({ summary: ' create image ' })
  @Post()
  async createImage(@Body() data: ImageDto) {
    try {
      const result = await this.imageService.createImage(data);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  // @ApiOperation({ summary: '' })
  // @Get(':id')
  // async getUrl(@Param('id') id: string) {}
}
