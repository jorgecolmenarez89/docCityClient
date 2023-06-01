import React, {createContext, useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {useToast, Box} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text} from '@rneui/base';
import {useTheme} from '@rneui/themed';

import {axiosInstance} from '../config/api';
import useNotification from '../hooks/useNotification';
import ModalNotification from '../components/organisms/ModalNotification';
import useAppState from '../hooks/useAppState';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const toast = useToast();
  const {theme} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userLoged, setUserLoged] = useState(null);
  const [navigation, setNavigation] = useState();
  const {token, showNotification, notification, onDeleteNotification} = useNotification();
  const [chats, setChats] = useState([]);
  const {appState, updateId} = useAppState();

  const login = async (username, password) => {
    setAuthLoading(true);
    console.log('login() => { token }', {token});
    const url = `/users/GetUserInfoForLogin/${username}/${password}/${token}`;
    try {
      const response = await axiosInstance.get(url);
      setIsLoading(false);
      setAuthLoading(false);
      changeUserLoged(response.data);
      updateId(response.data.id);
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
      updateId(response.data.id);
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
      console.log('id', JSON.parse(userToken).id);
      updateId(JSON.parse(userToken).id);
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

  const showToast = ({type, title, description}) => {
    let colorBackground = theme.colors.success;

    if (type === 'error') {
      colorBackground = theme.colors.error;
    } else if (type === 'info') {
      colorBackground = theme.colors.warning;
    }

    toast.show({
      render: () => {
        return (
          <Box bg={colorBackground} px='4' py='2' rounded='sm' mb={5}>
            {title && <Text style={{color: theme.colors.white}}>{title}</Text>}
            {description && <Text style={{color: theme.colors.white}}>{description}</Text>}
          </Box>
        );
      },
      placement: 'bottom',
      variant: 'left-accent',
    });
  };

  const onUpdateNavigation = newNavigation => {
    setNavigation(newNavigation);
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
        showToast,
        onUpdateNavigation,
        navigation,
        appState,
      }}>
      {children}
      {notification && (
        <ModalNotification onClose={() => onDeleteNotification()} {...{notification}} />
      )}
    </AuthContext.Provider>
  );
};
