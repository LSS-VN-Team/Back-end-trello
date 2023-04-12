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
import { CommentService } from '../comment/comment.service';
import { CM, CommentDocument } from '../comment/comment.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // @InjectModel(CM.name) private commentModel: Model<CommentDocument>,
    private readonly commentService: CommentService,
  ) {}

  async getAll(filter: TaskFilterDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};
    if (filter.idCard) {
      query.idCard = filter.idCard;
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
      newTask.id = newTask._id.toString();
      const task = await newTask.save();
      card.taskList.push(newTask);
      await this.cardModel.findByIdAndUpdate(
        data.idCard,
        { taskList: card.taskList },
        { new: true },
      );
      return task;
    }
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
  async showAllTaskByIdCard(idcard: string) {
    const newObject = [{ idTask: '1', title: '2' }];
    newObject.splice(0, 1);
    const card = await this.cardModel.findById(idcard).lean();
    for (let i = 0; i < card.taskList.length; i++) {
      const task = await this.taskModel.findById(card.taskList.at(i)).lean();
      const value = { idTask: task._id.toString(), title: task.title };
      newObject.push(value);
    }
    return newObject;
  }
  async removeUpToDown(idTask: string) {
    const task = await this.taskModel.findById(idTask).lean();

    while (task.commentList.length) {
      this.commentService.removeUptoDown(task.commentList.at(0));
      task.commentList.splice(0, 1);
    }

    return this.taskModel.findByIdAndDelete(idTask);
  }
  async remove(idTask: string) {
    const task = await this.taskModel.findById(idTask).lean();
    if (!task) throw new Error(`Task with id is ${idTask} does not exist`);
    else {
      while (task.commentList.length) {
        this.commentService.removeUptoDown(task.commentList.at(0));
        task.commentList.splice(0, 1);
      }

      const card = await this.cardModel.findById(task.idCard).lean();
      for (let i = 0; i < card.taskList.length; i++)
        if (card.taskList.at(i).id == idTask) {
          card.taskList.splice(i, 1);
          await this.cardModel.findByIdAndUpdate(
            card._id,
            { taskList: card.taskList },
            { new: true },
          );
          break;
        }
      return this.taskModel.findByIdAndDelete(idTask);
    }
  }
}
