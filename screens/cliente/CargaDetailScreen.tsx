import {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Image, Button, Icon} from '@rneui/themed';
import Triaje from '../../components/Triaje';

function CargaDetailScreen({navigation, route}: any) {
  const {id} = route.params;
  return (
    <View style={{flex: 1, backgroundColor: '#f6f7fc', paddingTop: 50}}>
      <View style={{flex: 1, paddingHorizontal: 20, width: '100%'}}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            width: '100%',
            marginBottom: 0,
          }}>
          <Text style={styles.title}>Gestionar Familiar</Text>
        </View>
        <View style={{width: '100%', flex: 1}}>
          <Triaje idUser={id} parent={false} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fc',
  },
  inputContainer: {
    width: '100%',
    paddingVertical: 8,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7d7d7d',
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  label: {
    fontSize: 17,
    color: '#15193f',
    fontFamily: 'Poppins-Medium',
  },
  contentLinks: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  inputIcon: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7d7d7d',
    paddingHorizontal: 10,
    height: 50,
  },
  inputStyle: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    height: 50,
    color: '#000000',
  },
  title: {
    fontSize: 22,
    color: '#06060a',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default CargaDetailScreen;
