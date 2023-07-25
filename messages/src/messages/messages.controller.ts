import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  listMessages() {
    return this.messagesService.findAll();
  }

  @Post()
  async createMessage(@Body() body: CreateMessageDto) {
    const errors = await validate(body);

    if (errors.length) throw new BadRequestException(errors);

    return this.messagesService.create(body.message);
  }

  @Get('/:id')
  async getMessage(@Param('id') id: any) {
    const message = await this.messagesService.findOne(id);
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }
}
