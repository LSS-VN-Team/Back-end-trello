import {
  PaginationOptions,
  removeKeyUndefined,
  totalPagination,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../Task/task.schema';
import { User, UserDocument } from '../user/user.schema';
import { CM, CommentDocument } from './comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentFilterDto } from './dto/filter-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(CM.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(filter: CommentFilterDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};
    if (filter.idUser) {
      query.idUser = { $regex: filter.idUser, $option: 'i' };
    }

    const countDocument = this.commentModel.countDocuments(query);
    const getcomment = this.commentModel.find(query).skip(skip).limit(limit);

    const [amount, comment] = await Promise.all([countDocument, getcomment]);

    return {
      totalPage: totalPagination(amount, limit),
      currentPage: page,
      data: comment,
    };
  }

  async findOne(id: string) {
    const comment = await this.commentModel.findById({ _id: id }).lean();
    if (!comment) throw new Error(`comment with id is ${id} does not exist`);
    return comment;
  }

  async create(data: CreateCommentDto) {
    const task = await this.taskModel.findById(data.idTask).lean();
    if (!task)
      throw new Error(`Task ID with id is ${data.idTask} does not exist`);
    else {
      const newComment = new this.commentModel(data);
      const saveComment = await newComment.save();
      task.commentList.push(newComment._id.toString());
      await this.taskModel.findByIdAndUpdate(
        data.idTask,
        { commentList: task.commentList },
        { new: true },
      );
      return [newComment, task];
    }
  }

  async update(id: string, data: UpdateCommentDto) {
    const cmt = await this.commentModel.findById(id).lean();
    if (!cmt) throw new Error(`Comment with id is ${id} does not exist`);

    const commentInstance = plainToInstance(CM, data);

    removeKeyUndefined(commentInstance);
    return this.taskModel.findByIdAndUpdate(
      id,
      { ...cmt, ...commentInstance, updatedAt: new Date() },
      { new: true },
    );
  }

  async removeUptoDown(idCmt: string) {
    return this.commentModel.findByIdAndDelete(idCmt);
  }
  async remove(idCmt: string) {
    const cmt = await this.commentModel.findById(idCmt).lean();
    if (!cmt) throw new Error(`Comment with id is ${idCmt} does not exist`);
    else {
      const task = await this.taskModel.findById(cmt.idTask).lean();
      for (let i = 0; i < task.commentList.length; i++)
        if (task.commentList.at(i) == idCmt) {
          task.commentList.splice(i, 1);
          await this.taskModel.findByIdAndUpdate(
            task._id,
            { commentList: task.commentList },
            { new: true },
          );
          break;
        }
      return this.commentModel.findByIdAndDelete(idCmt);
    }
  }
}
