import {
  PaginationOptions,
  removeKeyUndefined,
  totalPagination,
} from '@app/common';
import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { Board, BoardDocument } from '../board/board.schema';
import { User, UserDocument } from '../user/user.schema';
import { Card, CardDocument } from './card.schema';
import { CardDto } from './dtos/create-card.dto';
import { FillterCardDto } from './dtos/fillter-card.dto';
import { Task, TaskDocument } from '../task/task.schema';
import { TaskService } from '../task/task.service';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly taskService: TaskService,
  ) {}

  async getAll(filter: FillterCardDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};

    if (filter.idBoard) {
      query.idBoard = filter.idBoard;
    }

    const countDocument = this.cardModel.countDocuments(query);
    const getCard = this.cardModel.find(query).skip(skip).limit(limit);

    const [amount, Card] = await Promise.all([countDocument, getCard]);

    return {
      totalPage: totalPagination(amount, limit),
      currentPage: page,
      data: Card,
    };
  }

  async create(data: CardDto) {
    const board = await this.boardModel.findById(data.idBoard).lean();
    if (!board)
      throw new Error(`AdminID with id is ${data.idBoard} does not exist`);
    else {
      const newCard = new this.cardModel(data);
      const card = await newCard.save();

      const updateData: string[] = board.cardList;
      updateData.push(newCard._id.toString());
      const newUser = await this.boardModel.findByIdAndUpdate(
        data.idBoard,
        { cardList: updateData },
        { new: true },
      );
      return card;
    }
  }
  // async findAll(T): Promise<Task[]> {
  //   return await this.taskModel.find().populate('title', 'idCard').exec();
  // }

  async findOne(id: string) {
    const card = await this.cardModel.findById({ _id: id }).lean();
    if (!card) throw new Error(`card with id is ${id} does not exist`);
    return card;
  }
  async getById(id: string) {
    const card = await this.cardModel.findOne({ _id: id }).lean();
    if (!card) throw new Error(`User with id is ${id} does not exist`);
    return card;
  }

  async update(id: string, data: CardDto) {
    const card = await this.cardModel.findById({ _id: id }).lean();
    if (!card) throw new Error(`card with id is ${id} does not exist`);

    const userInstance = plainToInstance(Card, data);

    removeKeyUndefined(userInstance);

    return this.cardModel.findByIdAndUpdate(
      id,
      { ...card, ...userInstance, updatedAt: new Date() },
      { new: true },
    );
  }

  async removeAll(idCard: string) {
    const card = await this.cardModel.findById(idCard).lean();
    for (let i = 0; i < card.taskList.length; i++)
      this.taskService.remove(card.taskList.at(0).id);
    return this.cardModel.findByIdAndDelete(idCard);
  }

  async removeUpToDown(idCard: string) {
    const card = await this.cardModel.findById(idCard).lean();
    while (card.taskList.length) {
      this.taskService.removeUpToDown(card.taskList.at(0).id);
      card.taskList.splice(0, 1);
    }

    return this.cardModel.findByIdAndDelete(idCard);
  }

  async remove(idCard: string) {
    const card = await this.cardModel.findById(idCard).lean();
    if (!card) throw new Error(`Card with id is ${idCard} does not exist`);
    else {
      while (card.taskList.length != 0) {
        this.taskService.removeUpToDown(card.taskList.at(0).id);
        card.taskList.splice(0, 1);
      }
      const board = await this.boardModel.findById(card.idBoard).lean();
      if (!board)
        throw new Error(`Project Board with id is ${idCard} does not exist`);
      else {
        for (let i = 0; i < board.cardList.length; i++)
          if (board.cardList.at(i) == idCard) {
            board.cardList.splice(i, 1);
            break;
          }
        await this.boardModel.findByIdAndUpdate(
          card.idBoard,
          { cardList: board.cardList },
          { new: true },
        );
      }
      return this.cardModel.findByIdAndDelete(idCard);
    }
  }
  async moveInCard(idTask: string, pos: number) {
    const task = await this.taskModel.findById(idTask).lean();
    const card = await this.cardModel.findById(task.idCard).lean();
    for (let i = 0; i < card.taskList.length; i++) {
      if (card.taskList.at(i).id == idTask) {
        const index = i;
        if (pos < index) {
          const task = await this.taskModel.findById(idTask).lean();
          card.taskList.splice(pos, 0, task);
          card.taskList.splice(index + 1, 1);
        } else {
          const task = await this.taskModel.findById(idTask).lean();
          card.taskList.splice(pos + 1, 0, task);
          card.taskList.splice(index, 1);
        }
        break;
      }
    }

    await this.cardModel.findByIdAndUpdate(
      task.idCard,
      {
        taskList: card.taskList,
      },
      { new: true },
    );
    return card;
  }

  async moveTaskToAnother(idTask: string, idPosCard: string, pos: number) {
    const task = await this.taskModel.findById(idTask).lean();
    const oldCard = await this.cardModel.findById(task.idCard).lean();
    for (let i = 0; i < oldCard.taskList.length; i++) {
      if (oldCard.taskList.at(i).id == idTask) {
        const newCard = await this.cardModel.findById(idPosCard).lean();
        const task = await this.taskModel.findById(idTask).lean();

        newCard.taskList.splice(pos, 0, task);
        task.idCard = newCard._id.toString();
        oldCard.taskList.splice(i, 1);
        await this.cardModel.findByIdAndUpdate(
          newCard._id.toString(),
          { taskList: newCard.taskList },
          { new: true },
        );
        await this.cardModel.findByIdAndUpdate(
          oldCard._id.toString(),
          { taskList: newCard.taskList },
          { new: true },
        );
        await this.taskModel.findByIdAndUpdate(
          idTask,
          { idCard: task.idCard },
          { new: true },
        );
        break;
      }
    }
    return oldCard;
  }
}
