import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosInstance} from '../config/api';
import {Alert} from 'react-native';
import useNotification from '../hooks/useNotification';
import ModalNotification from '../components/organisms/ModalNotification';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userLoged, setUserLoged] = useState(null);
  const {token, showNotification, notification, onDeleteNotification} = useNotification();
  const [chats, setChats] = useState([]);

  const login = async (username, password) => {
    setAuthLoading(true);
    console.log('login() => { token }', {token});
    const url = `/users/GetUserInfoForLogin/${username}/${password}/${token}`;
    try {
      const response = await axiosInstance.get(url);
      setIsLoading(false);
      setAuthLoading(false);
      changeUserLoged(response.data);
    } catch (error) {
      if (error.response.status === 400) {
        setIsLoading(false);
        setAuthLoading(false);
        Alert.alert('Atención', error.response.data);
      } else {
        Alert.alert('Error', 'Ha Ocurrido un error intente nuevamente');
        setIsLoading(false);
        setAuthLoading(false);
      }
    }
  };

  const register = async data => {
    setAuthLoading(true);
    const url = '/users/CreateUser';
    try {
      const response = await axiosInstance.post(
        url,
        {...data, token},
        {
          headers: {'Content-Type': 'application/json'},
        },
      );
      setAuthLoading(false);
      setIsLoading(false);
      changeUserLoged(response.data);
    } catch (error) {
      if (error.response.status === 400) {
        setAuthLoading(false);
        setIsLoading(false);
        Alert.alert('Atención', error.response.data);
      } else {
        Alert.alert('Error', 'Ha Ocurrido un error intente nuevamente');
      }
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      setUserLoged(JSON.parse(userToken));
      setUserToken(userToken);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log('isLoggeIn in error' + e);
    }
  };

  const changeUserLoged = async data => {
    setUserLoged(data);
    await AsyncStorage.setItem('userToken', JSON.stringify(data));
    setUserToken(JSON.stringify(data));
  };

  const updateChats = data => {
    setChats(data);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register,
        changeUserLoged,
        isLoading,
        userToken,
        authLoading,
        userLoged,
        setIsLoading,
        showNotification,
        token,
        chats,
        updateChats,
      }}>
      {children}
      {notification && (
        <ModalNotification onClose={() => onDeleteNotification()} {...{notification}} />
      )}
    </AuthContext.Provider>
  );
};
