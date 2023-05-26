import firestore from '@react-native-firebase/firestore';

import Doctor from '../../models/Doctor';
import User, {UserModel} from '../../models/User';
import Chat from '../../models/Chat';
import ChatMessage from '../../models/ChatMessage';

export const createChat = async ({user, doctor}: {user: any; doctor: any}) => {
  try {
    await firestore().collection('chats').add(Chat.create({user, doctor}));
  } catch (err: any) {
    console.log('createChat() ==> err', {err});
    return {status: false, message: 'No fue posible iniciar la conversación.'};
  }
};

export const addMessage = async ({chat, message}: {chat: Chat; message: ChatMessage}) => {
  try {
    await firestore()
      .collection('chats')
      .doc(chat.data.id)
      .update({
        updateAt: new Date(),
        messages: firestore.FieldValue.arrayUnion([message.send()]),
      });
  } catch (err: any) {
    console.log('addMessage() ==> err', {err});
    return {status: false, message: 'No fue posible escribir el mensaje.'};
  }
};

export const getAllChats = async (params: {user: UserModel}) => {
  try {
    const result = await firestore()
      .collection('chats')
      .where('userId', '==', params.user.id)
      .get();
    const chats: Chat[] = [];
    result.forEach(doc => {
      chats.push(
        new Chat(Chat.formatData({data: {...doc.data(), id: doc.id}, userLog: params.user})),
      );
    });
    return {status: true, data: chats};
  } catch (err: any) {
    console.log('addMessage() ==> err', {err});
    return {status: false, message: 'No fue posible obtener los chats.'};
  }
};
