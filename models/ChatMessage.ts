import moment from 'moment';
import {dateMessage} from '../helpers/Converts';

export enum ChatMessageStatus {
  new = 'new',
  read = 'read',
}

interface ChatMessageModel {
  id?: string;
  text: string;
  imgs: string[];
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
    const {text, imgs, autorId, status, updateAt, createAt} = data;

    return {
      text: text,
      imgs: imgs,
      autorId: autorId,
      status: status,
      updateAt: updateAt?.toDate() || undefined,
      createAt: createAt?.toDate() || undefined,
      createAtDisplay: createAt ? dateMessage(createAt?.toDate()) : undefined,
      updateAtDisplay: updateAt ? dateMessage(updateAt?.toDate()) : undefined,
    };
  }

  send() {
    const {text, autorId, imgs, status} = this.data;
    let dataSend = {
      autorId,
      status,
      createAt: new Date(),
    };

    if (imgs) {
      dataSend.imgs = imgs;
    }
    if (text) {
      dataSend.text = text;
    }

    return dataSend;
  }
}

export default ChatMessage;
