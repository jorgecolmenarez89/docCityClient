import moment from 'moment';
import {dateMessage} from '../helpers/Converts';

export enum ChatMessageStatus {
  new = 'new',
  read = 'read',
}

interface ChatMessageModel {
  id?: string;
  text: string;
  autorId: string;
  status: ChatMessageStatus;
  updateAt?: number | Date;
  updateAtDisplay?: string;
  createAt?: number | Date;
  createAtDisplay?: string;
}

class ChatMessage {
  data: ChatMessageModel;

  constructor(data: ChatMessageModel) {
    this.data = data;
  }

  static formatData(data: any): ChatMessageModel {
    const {text, autorId, status, updateAt, createAt} = data;

    return {
      text: text,
      autorId: autorId,
      status: status,
      updateAt: updateAt?.toDate() || undefined,
      createAt: createAt?.toDate() || undefined,
      createAtDisplay: createAt ? dateMessage(createAt?.toDate()) : undefined,
      updateAtDisplay: updateAt ? dateMessage(updateAt?.toDate()) : undefined,
    };
  }

  send() {
    const {text, autorId, status} = this.data;
    return {
      text,
      autorId,
      status,
      createAt: new Date(),
    };
  }
}

export default ChatMessage;
