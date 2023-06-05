import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {StateUserInUseApp} from '../config/Enum';

const useAppState = () => {
  const [idUser, setIdUser] = useState<string>();
  const [appState, setAppState] = useState(AppState.currentState);

  const updateId = (id: string) => {
    setIdUser(id);
    createUserState(id);
  };

  const createUserState = async (id: string) => {
    await firestore().collection('users').doc(id).set({
      state: StateUserInUseApp.onLine,
    });
  };

  const updateUserState = async (state: StateUserInUseApp) => {
    console.log('updateUserState() ==> ', {state, idUser});
    await firestore().collection('users').doc(idUser).set({
      state: state,
    });
  };

  const handleAppStateChange = nextAppState => {
    console.log('handleAppStateChange() ==> ', {nextAppState, idUser});
    if (nextAppState === 'active') {
      setAppState(StateUserInUseApp.onLine);
      updateUserState(StateUserInUseApp.onLine);
    } else {
      setAppState(StateUserInUseApp.outLine);
      updateUserState(StateUserInUseApp.outLine);
    }
  };

  useEffect(() => {
    const subcript = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subcript.remove();
    };
  }, [idUser]);

  return {appState, updateId};
};

export default useAppState;
