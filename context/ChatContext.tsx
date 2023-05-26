import {createContext, ReactNode, useState} from 'react';
import {create} from 'react-test-renderer';
import Chat from '../models/Chat';

interface ChatContextData {
  notifications: number;
  chats: Chat[];
  updateNotifications: (value: number) => void;
  updateChats: (chats: Chat[]) => void;
}

export const ChatContext = createContext<ChatContextData>({} as ChatContextData);

const ChatContextProvider = ({children}: {children: ReactNode}) => {
  const [notifications, setNotifications] = useState<number>(0);
  const [chats, setChats] = useState<Chat[]>([]);

  const updateNotifications = (value: number) => {
    setNotifications(value);
  };

  const updateChats = (value: Chat[]) => {
    setChats(value);
  };

  return (
    <ChatContext.Provider value={{chats, notifications, updateNotifications, updateChats}}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
