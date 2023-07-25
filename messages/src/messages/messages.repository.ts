import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

// export interface IMessagesRepository {
//   findOne(id: string): any;
//   findAll(): any;
//   create(message: string): any;
// }

@Injectable()
export class MessagesRepository {
  async findOne(id: string) {
    const content = await readFile('messages.json', 'utf-8');
    const messages = JSON.parse(content);

    return messages[id];
  }

  async findAll() {
    const content = await readFile('messages.json', 'utf-8');

    return content;
  }

  async create(message: string) {
    const content = await readFile('messages.json', 'utf-8');
    const messages = JSON.parse(content);

    const id = Math.ceil(Math.random() * 1_000_000);

    messages[id] = { id, message };

    return writeFile('messages.json', JSON.stringify(messages));
  }
}
