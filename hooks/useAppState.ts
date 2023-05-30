import {useEffect, useState} from 'react';
import {AppState} from 'react-native';

const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  const handleAppStateChange = nextAppState => {
    console.log('handleAppStateChange() ==> ', {nextAppState});
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return {appState};
};

export default useAppState;
