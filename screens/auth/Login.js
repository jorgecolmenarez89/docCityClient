import React, {useContext, useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import {Button, Icon} from '@rneui/themed';
import {axiosInstance} from '../../config/api';

function Login({navigation}) {
  const [user, setUser] = useState({
    userName: '',
    password: '',
  });
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const {changeUserLoged, token} = useContext(AuthContext);

  const handleChange = (text, name) => {
    setUser({
      ...user,
      [name]: text,
    });
  };

  const handleLogin = async () => {
    if (user.userName === '') {
      Alert.alert('Atención', 'Campo usuario es requerido');
    } else if (user.password === '') {
      Alert.alert('Atención', 'Campo conraseña es requerido');
    } else {
      setLoading(true);
      const url = `/users/GetUserInfoForLogin/${user.userName}/${user.password}/${token}`;
      try {
        const response = await axiosInstance({isNode: false}).get(url);
        setLoading(false);
        changeUserLoged(response.data);
      } catch (error) {
        if (error.response.status === 400) {
          setLoading(false);
          Alert.alert('Atención', error.response.data);
        } else {
          Alert.alert('Error', 'Ha Ocurrido un error intente nuevamente');
          setLoading(false);
        }
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f7fc',
      }}>
      <View style={{width: '100%', paddingHorizontal: 30}}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            maxLength={40}
            style={styles.input}
            onChangeText={text => handleChange(text, 'userName')}
            value={user.userName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>

          <View style={styles.inputIcon}>
            <TextInput
              style={styles.inputStyle}
              maxLength={40}
              onChangeText={text => handleChange(text, 'password')}
              value={user.password}
              secureTextEntry={hidePassword}
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
          <Button
            raised={false}
            title='Iniciar sesión'
            buttonStyle={{
              backgroundColor: '#0b445e',
              borderRadius: 30,
              height: 50,
            }}
            titleStyle={{
              fontFamily: 'Poppins-SemiBold',
            }}
            onPress={() => {
              handleLogin();
            }}
            loading={loading}
          />
        </View>
        <View style={styles.contentLinks}>
          <Button
            title='Regístrate'
            onPress={() => navigation.navigate('Register')}
            type='clear'
            titleStyle={{
              color: '#4c71c9',
              fontFamily: 'Poppins-SemiBold',
            }}
          />
          <Text style={{marginHorizontal: 2}} />
          <Button
            title='Olvidé contraseña'
            onPress={() => navigation.navigate('VerifyEmail')}
            type='clear'
            titleStyle={{
              color: '#4c71c9',
              fontFamily: 'Poppins-SemiBold',
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    paddingVertical: 8,
  },
  input: {
    width: '100%',
    color: '#000000',
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    fontFamily: 'Poppins-Medium',
    borderWidth: 2,
    borderColor: '#7d7d7d',
  },
  label: {
    fontSize: 17,
    color: '#06060a',
    fontFamily: 'Poppins-Medium',
  },
  contentLinks: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
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
    height: 50,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
});
