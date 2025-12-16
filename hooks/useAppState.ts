import {useEffect, useState, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {StateUserInUseApp} from '../config/Enum';

const useAppState = () => {
  const [idUser, setIdUser] = useState<string>();
  const [appState, setAppState] = useState(AppState.currentState);
  const idUserRef = useRef<string>(); // Usar ref para tener siempre el valor actualizado

  const updateId = (id: string) => {
    setIdUser(id);
    idUserRef.current = id; // Actualizar también el ref
    createUserState(id);
  };

  const createUserState = async (id: string) => {
    // Usar .update() para solo actualizar el campo state sin sobrescribir otros campos
    try {
      await firestore().collection('users').doc(id).update({
        state: StateUserInUseApp.onLine,
      });
    } catch (error) {
      // Si el documento no existe, usar .set() con merge
      await firestore().collection('users').doc(id).set(
        {
          state: StateUserInUseApp.onLine,
        },
        {merge: true},
      );
    }
  };

  const updateUserState = async (state: StateUserInUseApp) => {
    const currentId = idUserRef.current; // Usar el ref para tener el valor actualizado
    if (!currentId) {
      console.warn('updateUserState: No hay ID de usuario disponible');
      return;
    }
    try {
      // Usar .update() para solo actualizar el campo state
      await firestore().collection('users').doc(currentId).update({
        state: state,
      });
    } catch (error) {
      console.error('Error actualizando estado del usuario:', error);
    }
  };

  const handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      setAppState(StateUserInUseApp.onLine);
      updateUserState(StateUserInUseApp.onLine);
    } else {
      setAppState(StateUserInUseApp.outLine);
      updateUserState(StateUserInUseApp.outLine);
    }
  };

  useEffect(() => {
    // Solo registrar el listener si hay un idUser
    if (!idUser) {
      return;
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [idUser]); // Mantener idUser como dependencia

  return {appState, updateId};
};

export default useAppState;
