import { PaginationOptions, removeKeyUndefined, totalPagination } from "@app/common";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { Card, CardDocument } from "../card/card.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskFilterDto } from "./dto/filter-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task, TaskDocument } from "./task.schema";

@Injectable()
export class TaskService{
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    ){}

    async findAll(filter: TaskFilterDto, pagination: PaginationOptions) {
        const { limit, page, skip } = pagination;
        const query: any = {};
        if (filter.title) {
          query.email = { $regex: filter.title, $option: 'i' };
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
        else{
            const newTask = new this.taskModel(data.title);
            const task = await newTask.save();
            card.taskList.push(newTask._id.toString());
            await this.cardModel.findByIdAndUpdate(
                data.idCard,
                {taskList: card.taskList},
                {new: true},
            );
        return task;
        }
    }
    

    async remove(idCard: string,idTask: string) {
    const task = await this.taskModel.findById(idTask).lean();
    if (!task)
        throw new Error(`Task with id is ${idTask} does not exist`);
    
    else{
        const card = await this.cardModel.findById(idCard).lean();
        for (let i=0;i<card.taskList.length;i++)
            if (card.taskList.at(i)==idTask){
                card.taskList.splice(i,1);
                await this.cardModel.findByIdAndUpdate(
                    card.id,
                    {taskList: card.taskList},
                    {new: true},
                );
                break;
            }
        return this.taskModel.findByIdAndDelete(idTask);
    }    
    }

    async update(id: string, data: UpdateTaskDto) {
        const task = await this.taskModel.findById(id).lean();
        if (!task)
          throw new Error(`Task with id is ${id} does not exist`);
    
        const taskInstance = plainToInstance(Task, data);
    
        removeKeyUndefined(taskInstance);
        return this.taskModel.findByIdAndUpdate(
          id,
          { ...task, ...taskInstance, updatedAt: new Date() },
          { new: true },
        );
    }
}