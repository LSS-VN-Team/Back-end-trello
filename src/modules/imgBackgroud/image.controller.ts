import { Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './image.schema';
import { ImageService } from './image.service';

@ApiTags('Project Board')
@Controller('board')
export class ImageController {
  @InjectModel(Image.name)
  private readonly imageModel: Model<ImageDocument>;
  constructor(private readonly imageService: ImageService) {}

  private readonly logger = new Logger(ImageController.name);
  @Get('/findall/:id')
  async findAll(): Promise<Image[]> {
    return this.imageService.findAll();
  }
  @Get('/findone/:id')
  async findOne(@Param('id') id: string): Promise<Image> {
    return this.imageService.findOne(id);
  }
  @Get(':id/url')
  async getUrl(@Param('id') id: string): Promise<string> {
    const image = await this.imageService.findOne(id);

    if (!image) {
      throw new Error(`Image with id ${id} not found`);
    }

    return image.name;
  }
}
