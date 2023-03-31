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

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async getAll(filter: FillterCardDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};

    if (filter.name) {
      query.admin = { $regex: filter.name, $options: 'i' };
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
    const board = await this.boardModel.findById(data.BoardId).lean();
    if (!board)
      throw new Error(`AdminID with id is ${data.BoardId} does not exist`);
    else {
      const newCard = new this.cardModel(data);
      const card = await newCard.save();

      const updateData: string[] = board.cardList;
      updateData.push(newCard._id.toString());
      const newUser = await this.userModel.findByIdAndUpdate(
        data.BoardId,
        { taskList: updateData },
        { new: true },
      );
      return card;
    }
  }
  async findAll(): Promise<Card[]> {
    return this.cardModel.find().exec();
  }

  async findOne(id: string): Promise<Card> {
    return this.cardModel.findById(id).exec();
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

  async remove(id: string) {
    const card = await this.cardModel.findOne({ _id: id }).lean();
    if (!card) throw new Error(`card with id is ${id} does not exist`);
    return this.cardModel.findByIdAndDelete(id);
  }
}
