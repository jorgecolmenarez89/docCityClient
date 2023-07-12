import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationRoutes} from '../../config/Enum';
import {RootStackParamList} from '../../config/Types';
import DetailConsultation from '../../components/consultations/Detail';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList>;

function ConsultasDetailScreen({navigation, route}: DetailScreenProps) {
  return <DetailConsultation navigation={navigation} route={route} />;
}

export default ConsultasDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
