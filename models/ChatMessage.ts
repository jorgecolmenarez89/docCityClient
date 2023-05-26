import moment from 'moment';
import {dateMessage} from '../helpers/Converts';

enum ChatMessageStatus {
  new = 'new',
  read = 'read',
}

interface ChatMessageModel {
  text: string;
  autorId: string;
  status: ChatMessageModel;
  updateAt?: number;
  updateAtDisplay?: string;
  createAt?: number;
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
      updateAt: updateAt,
      createAt: createAt,
      createAtDisplay: dateMessage(createAt),
    };
  }

  send() {
    const {text, autorId, status} = this.data;
    return {
      text,
      autorId,
      status,
    };
  }
}

export default ChatMessage;
