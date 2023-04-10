import {
  PaginationOptions,
  removeKeyUndefined,
  totalPagination,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { Board, BoardDocument } from '../board/board.schema';
import { TaskService } from '../Task/task.service';
import { Card, CardDocument } from './card.schema';
import { CreateCardDto } from './dto/create-card.dto';
import { CardFilterDto } from './dto/filter-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    private readonly taskSerVice: TaskService,
  ) {}

  async findAll(filter: CardFilterDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};
    if (filter.name) {
      query.name = { $regex: filter.name, $options: '$i' };
    }

    const countDocument = this.cardModel.countDocuments(query);
    const getcard = this.cardModel.find(query).skip(skip).limit(limit);

    const [amount, card] = await Promise.all([countDocument, getcard]);

    return {
      totalPage: totalPagination(amount, limit),
      currentPage: page,
      data: card,
    };
    // return `This action returns all card`;
  }

  async findOne(id: string) {
    const card = await this.cardModel.findById({ _id: id }).lean();
    if (!card) throw new Error(`card with id is ${id} does not exist`);
    return card;
  }
  async create(data: CreateCardDto) {
    const newCard = new this.cardModel(data);
    const board = await this.boardModel.findById(data.idBoard).lean();
    if (!board)
      throw new Error(`Board ID with id is ${data.idBoard} does not exist`);
    else {
      await newCard.save();
      board.cardList.push(newCard._id.toString());
      await this.boardModel.findByIdAndUpdate(
        data.idBoard,
        { cardList: board.cardList },
        { new: true },
      );
      return newCard;
    }
  }

  async removeAll(idCard: string) {
    const card = await this.cardModel.findById(idCard).lean();
    for (let i = 0; i < card.taskList.length; i++)
      this.taskSerVice.remove(card.taskList.at(0));
    return this.cardModel.findByIdAndDelete(idCard);
  }

  async removeUpToDown(idCard: string) {
    const card = await this.cardModel.findById(idCard).lean();
    while (card.taskList.length) {
      this.taskSerVice.removeUpToDown(card.taskList.at(0));
      card.taskList.splice(0, 1);
    }

    return this.cardModel.findByIdAndDelete(idCard);
  }

  async remove(idCard: string) {
    const card = await this.cardModel.findById(idCard).lean();
    if (!card) throw new Error(`Card with id is ${idCard} does not exist`);
    else {
      while (card.taskList.length != 0) {
        this.taskSerVice.removeUpToDown(card.taskList.at(0));
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
  async update(id: string, data: string) {
    const card = await this.cardModel.findById(id).lean();
    if (!card) throw new Error(`Card with id is ${id} does not exist`);

    // const CardInstance = plainToInstance(Card, data);

    // removeKeyUndefined(CardInstance);
    // return this.cardModel.findByIdAndUpdate(
    //   id,
    //   { ...card, ...CardInstance, updatedAt: new Date() },
    //   { new: true },
    // );

    return await this.cardModel.findByIdAndUpdate(
      id,
      { name: data },
      { new: true },
    );
  }
}
