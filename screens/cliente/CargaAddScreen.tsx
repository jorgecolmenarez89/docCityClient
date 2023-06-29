import React, {useEffect, useState, useCallback, useContext} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  StyleSheet,
  TextInput,
} from 'react-native';
import {Button, Icon} from '@rneui/themed';
import {RootStackParamList} from '../../config/Types';
import {AuthContext} from '../../context/AuthContext';

type CargaListScreenProps = NativeStackScreenProps<RootStackParamList>;

function CargaAddScreen({navigation}: CargaListScreenProps) {
  const {changeUserLoged, token} = useContext(AuthContext);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    repeatPassword: '',
    deviceToken: token,
  });

  const handleChange = (text: string, name: string) => {
    setUser({
      ...user,
      [name]: text,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f6f7fc', paddingTop: 50}}>
      <View style={{flex: 1, paddingHorizontal: 30, width: '100%'}}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            width: '100%',
            marginBottom: 30,
          }}>
          <Text style={styles.title}>Registar Familiar</Text>
        </View>
        <View style={styles.inputContainer}>
          {/*<Text style={styles.label}>Usuario</Text>*/}
          <TextInput
            maxLength={40}
            style={styles.input}
            onChangeText={text => handleChange(text, 'username')}
            value={user.username}
            placeholder='Nombre de usuario'
            placeholderTextColor={'#7d7d7d'}
          />
        </View>
        <View style={styles.inputContainer}>
          {/*<Text style={styles.label}>Correo electrónico</Text>*/}
          <TextInput
            maxLength={40}
            style={styles.input}
            onChangeText={text => handleChange(text, 'email')}
            value={user.email}
            placeholder='Correo electrónico'
            placeholderTextColor={'#7d7d7d'}
          />
        </View>
        <View style={styles.inputContainer}>
          {/*<Text style={styles.label}>Nombres</Text>*/}
          <TextInput
            style={styles.input}
            maxLength={40}
            onChangeText={text => handleChange(text, 'fullName')}
            value={user.fullName}
            placeholder='Nombre y Apellido'
            placeholderTextColor={'#7d7d7d'}
          />
        </View>
        <View style={styles.inputContainer}>
          {/*<Text style={styles.label}>Contraseña</Text>*/}
          <View style={styles.inputIcon}>
            <TextInput
              style={styles.inputStyle}
              maxLength={40}
              onChangeText={text => handleChange(text, 'password')}
              value={user.password}
              secureTextEntry={hidePassword}
              placeholder='Contraseña'
              placeholderTextColor={'#7d7d7d'}
            />
            <Icon
              name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
              type='ionicon'
              color='#7d7d7d'
              size={20}
              onPress={() => setHidePassword(!hidePassword)}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          {/*<Text style={styles.label}>Repita Contraseña</Text>*/}
          <View style={styles.inputIcon}>
            <TextInput
              style={styles.inputStyle}
              maxLength={40}
              onChangeText={text => handleChange(text, 'repeatPassword')}
              value={user.repeatPassword}
              secureTextEntry={hideRepeatPassword}
              placeholder='Repetir Contraseña'
              placeholderTextColor={'#7d7d7d'}
            />
            <Icon
              name={hideRepeatPassword ? 'eye-outline' : 'eye-off-outline'}
              type='ionicon'
              color='#7d7d7d'
              size={20}
              onPress={() => setHideRepeatPassword(!hideRepeatPassword)}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Button
            raised={false}
            title='Crear cuenta'
            onPress={() => {}}
            buttonStyle={{
              backgroundColor: '#0b445e',
              borderRadius: 30,
              height: 50,
            }}
            titleStyle={{
              fontFamily: 'Poppins-SemiBold',
            }}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

export default CargaAddScreen;
