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
      query.email = { $regex: filter.name, $option: 'i' };
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
    const board = await this.boardModel.findById(data.boardId).lean();
    if (!board)
      throw new Error(`Board ID with id is ${data.boardId} does not exist`);
    else {
      await newCard.save();
      board.cardList.push(newCard._id.toString());
      await this.boardModel.findByIdAndUpdate(
        data.boardId,
        { cardList: board.cardList },
        { new: true },
      );
      return [newCard, board];
    }
  }
  async remove(idCard: string, idBoard: string) {
    const card = await this.cardModel.findById(idCard).lean();
    if (!card) throw new Error(`Card with id is ${idCard} does not exist`);
    else {
      for (let i=card.taskList.length-1;i>=0;i--)
        this.taskSerVice.remove(idCard,card.taskList.at(i));
      const board = await this.boardModel.findById(idBoard).lean();
      if (!board)
        throw new Error(`Project Board with id is ${idCard} does not exist`);
      else {
        for (let i = 0; i < board.cardList.length; i++)
          if (board.cardList.at(i) == idCard) {
            board.cardList.splice(i, 1);
            break;
          }
        await this.boardModel.findByIdAndUpdate(
          idBoard,
          { cardList: board.cardList },
          { new: true },
        );
      }
      return this.cardModel.findByIdAndDelete(idCard);
    }
  }
  async update(id: string, data: UpdateCardDto) {
    const card = await this.cardModel.findById(id).lean();
    if (!card) throw new Error(`Card with id is ${id} does not exist`);

    const CardInstance = plainToInstance(Card, data);

    removeKeyUndefined(CardInstance);
    return this.cardModel.findByIdAndUpdate(
      id,
      { ...card, ...CardInstance, updatedAt: new Date() },
      { new: true },
    );
  }
}
