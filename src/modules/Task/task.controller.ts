import { Pagination, PaginationOptions } from '@app/common';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@ApiTags('Task')
@Controller('Task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  private readonly logger = new Logger(TaskController.name);

  @ApiOperation({ summary: 'Find all task' })
  @Get()
  async findAll(
    @Query() filter: TaskFilterDto,
    @Pagination() Pagination: PaginationOptions,
  ) {
    try {
      const result = await this.taskService.findAll(filter, Pagination);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Find one task' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.taskService.findOne(id);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Create Task' })
  @Post()
  async create(@Body() data: CreateTaskDto) {
    try {
      const result = await this.taskService.create(data);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Delete Task' })
  @Delete(':idCard/:idTask')
  async remove(
    @Param('idCard') idCard: string,
    @Param('idTask') idTask: string,
  ) {
    try {
      const result = await this.taskService.remove(idCard, idTask);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Update Task' })
  @Patch('id')
  async update(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    try {
      const result = await this.taskService.update(id, data);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Add Follower' })
  @Patch('/addFollower/:idTask/:idUser')
  async addFollower(@Param('idTask') idTask: string,@Param('idUser') idUser: string) {
    try {
      const result = await this.taskService.addFollower(idTask, idUser);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Remove Follower' })
  @Patch('/removeFollower/:idTask/:idUser')
  async removeFollower(@Param('idTask') idTask: string,@Param('idUser') idUser: string) {
    try {
      const result = await this.taskService.removeFollower(idTask, idUser);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Add Joinner' })
  @Patch('/addJoinner/:idTask/:idUser')
  async addJoinner(@Param('idTask') idTask: string,@Param('idUser') idUser: string) {
    try {
      const result = await this.taskService.addJoinner(idTask, idUser);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Remove Joinner' })
  @Patch('/removeJoinner/:idTask/:idUser')
  async removeJoinner(@Param('idTask') idTask: string,@Param('idUser') idUser: string) {
    try {
      const result = await this.taskService.removeJoinner(idTask, idUser);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

}
