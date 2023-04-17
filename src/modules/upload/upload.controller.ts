import { multerDiskOption } from '@app/common';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiPayloadTooLargeResponse,
  ApiTags,
} from '@nestjs/swagger';
import { url } from 'inspector';
import { async } from 'rxjs';
// import { UploadDocument, Upload } from './upload.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@ApiTags('upload')
@Controller('upload')
export class UpLoadController {
  // @InjectModel(Upload.name) private readonly imageModel: Model<UploadDocument>;

  private readonly logger = new Logger(UpLoadController.name);

  @Post()
  @UseInterceptors(FilesInterceptor('files', null, multerDiskOption))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiPayloadTooLargeResponse({
    description: 'The upload files size is greater than 10 MB',
  })
  async create(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      const fileURLS = files.map((x) => {
        return (
          'http://' +
          process.env.HOST +
          ':' +
          process.env.PORT +
          '/thumbs/' +
          x.filename
        );
      });
      return responseSuccess(fileURLS);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
}
