import {
  PaginationOptions,
  removeKeyUndefined,
  totalPagination,
} from '@app/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { Card, CardDocument } from '../card/card.schema';
import { User, UserDocument } from '../user/user.schema';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskFilterDto } from './dtos/fillter-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getAll(filter: TaskFilterDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};
    if (filter.title) {
      query.title = { $regex: filter.title, $option: 'i' };
    }

    const countDocument = this.taskModel.countDocuments(query);
    const gettask = this.taskModel.find(query).skip(skip).limit(limit);

    const [amount, task] = await Promise.all([countDocument, gettask]);

    return {
      totalPage: totalPagination(amount, limit),
      currentPage: page,
      data: task,
    };
    // return `This action returns all task`;
  }

  async findOne(id: string) {
    const task = await this.taskModel.findById({ _id: id }).lean();
    if (!task) throw new Error(`task with id is ${id} does not exist`);
    return task;
  }

  async create(data: CreateTaskDto) {
    const card = await this.cardModel.findById(data.idCard).lean();
    if (!card)
      throw new Error(`Card ID with id is ${data.idCard} does not exist`);
    else {
      const newTask = new this.taskModel(data);
      const task = await newTask.save();
      card.taskList.push(newTask._id.toString());
      const updateData: string[] = card.taskList;
      await this.cardModel.findByIdAndUpdate(
        data.idCard,
        { taskList: updateData },
        { new: true },
      );
      return task;
    }
  }
  async remove(id: string) {
    const task = await this.taskModel.findOne({ _id: id }).lean();
    if (!task) throw new Error(`task with id is ${id} does not exist`);
    return this.cardModel.findByIdAndDelete(id);
  }

  async update(id: string, data: UpdateTaskDto) {
    const task = await this.taskModel.findById(id).lean();
    if (!task) throw new Error(`Task with id is ${id} does not exist`);

    const taskInstance = plainToInstance(Task, data);

    removeKeyUndefined(taskInstance);
    return this.taskModel.findByIdAndUpdate(
      id,
      { ...task, ...taskInstance, updatedAt: new Date() },
      { new: true },
    );
  }

  async addFollower(idTask: string, idUser: string) {
    const user = await this.userModel.findById(idUser).lean();
    if (!user) throw new Error(`User with id is ${idUser} does not exist`);
    else {
      const task = await this.taskModel.findById(idTask).lean();
      if (!task) throw new Error(`Task with id is ${idTask} does not exist`);
      else {
        task.follower.push(idUser);
        const newData: string[] = task.follower;
        const newTask = await this.taskModel.findByIdAndUpdate(
          task._id,
          { follower: newData },
          { new: true },
        );
        return task;
      }
    }
  }

  async removeFollower(idTask: string, idUser: string) {
    const user = await this.userModel.findById(idUser).lean();
    if (!user) throw new Error(`User with id is ${idUser} does not exist`);
    else {
      const task = await this.taskModel.findById(idTask).lean();
      if (!task) throw new Error(`Task with id is ${idTask} does not exist`);
      else {
        for (let i = 0; i < task.follower.length; i++)
          if (task.follower.at(i) == idUser) {
            task.follower.splice(i, 1);
            break;
          }
        await this.taskModel.findByIdAndUpdate(
          task._id,
          { follower: task.follower },
          { new: true },
        );
        return task;
      }
    }
  }

  async addJoinner(idTask: string, idUser: string) {
    const user = await this.userModel.findById(idUser).lean();
    if (!user) throw new Error(`User with id is ${idUser} does not exist`);
    else {
      const task = await this.taskModel.findById(idTask).lean();
      if (!task) throw new Error(`Task with id is ${idTask} does not exist`);
      else {
        this.addFollower(idTask, idUser);
        task.joinner.push(idUser);
        await this.taskModel.findByIdAndUpdate(
          task._id,
          { joinner: task.joinner },
          { new: true },
        );
        return task;
      }
    }
  }

  async removeJoinner(idTask: string, idUser: string) {
    const user = await this.userModel.findById(idUser).lean();
    if (!user) throw new Error(`User with id is ${idUser} does not exist`);
    else {
      const task = await this.taskModel.findById(idTask).lean();
      if (!task) throw new Error(`Task with id is ${idTask} does not exist`);
      else {
        this.removeFollower(idTask, idUser);
        for (let i = 0; i < task.joinner.length; i++)
          if (task.joinner.at(i) == idUser) {
            task.joinner.splice(i, 1);
            break;
          }
        await this.taskModel.findByIdAndUpdate(
          task._id,
          { joinner: task.joinner },
          { new: true },
        );
        return task;
      }
    }
  }
}
