import {dateChat} from '../helpers/Converts';
import ChatMessage from './ChatMessage';
import Doctor, {DoctorModel} from './Doctor';
import User, {UserModel} from './User';

export enum ChatStatus {
  ACTIVE = 'active',
  FINISHED = 'finished',
}

export interface ChatModel {
  id?: string;
  doctor: DoctorModel;
  doctorId: string | number;
  user: UserModel;
  userId: string | number;
  messages: ChatMessage[];
  updateAt?: number;
  updateAtDisplay?: string;
  createAt?: number;
  createAtDisplay?: string;
  receiver?: DoctorModel | UserModel;
  requestFinish?: boolean;
  status?: ChatStatus;
}

class Chat {
  data: ChatModel;

  constructor(data: ChatModel) {
    this.data = data;
  }

  static formatData({data, userLog}: {data: any; userLog: UserModel}) {
    const {doctor, doctorId, user, userId, messages, updateAt, id, requestFinish, status} = data;

    return {
      id: id,
      doctor: doctor,
      doctorId: doctorId,
      user: user,
      userId: userId,
      messages:
        messages && messages.length > 0
          ? messages.map(msg => new ChatMessage(ChatMessage.formatData(msg)))
          : [],
      updateAt: updateAt?.toDate(),
      updateAtDisplay: updateAt ? dateChat(updateAt?.toDate()) : undefined,
      receiver: userLog.id !== doctor.id ? doctor : user,
      requestFinish: requestFinish ? requestFinish : false,
      status: status || ChatStatus.FINISHED,
    };
  }

  static create({doctor, user}: {doctor: DoctorModel; user: UserModel}) {
    const date = new Date();
    return {
      doctor: doctor,
      doctorId: doctor.id,
      user: user,
      userId: user.id,
      messages: [],
      createAt: date,
      updateAt: date,
      status: ChatStatus.ACTIVE,
    };
  }
}

export default Chat;
