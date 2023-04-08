import React, {useContext, useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Button, Icon, Image} from '@rneui/themed';
import {axiosInstance} from '../../config/api';

function Login({ navigation }) {

  const [user, setUser] = useState({
    userName: '',
    password: ''
  })
  const [hidePassword, setHidePassword] = useState(true)
  const [loading, setLoading] = useState(false)

  const {changeUserLoged} =  useContext(AuthContext)

  const handleChange = (text, name) => {
    setUser({
      ...user,
      [name]: text
    })
  }

  const handleLogin = async() => {
    if(user.userName === ''){
      Alert.alert('Atención','Campo usuario es requerido');
    } else if (user.password === '') {
      Alert.alert('Atención','Campo conraseña es requerido');
    } else {
      setLoading(true)
      const url = `/users/GetUserInfoForLogin/${user.userName}/${user.password}`;
      try {
        const response = await axiosInstance.get(url);
        setLoading(false);
        changeUserLoged(response.data);
      } catch (error) {
        if(error.response.status === 400){
          setLoading(false);
          Alert.alert('Atención', error.response.data);
        } else {
          Alert.alert('Error','Ha Ocurrido un error intente nuevamente');
          setIsLoading(false);
        }
      }
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>

      <View style={{ width: '100%', paddingHorizontal: 30 }}>

        <View style={{ display:'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
          <Image 
            source={require('../../assets/logo.png')}
            style={{ width: 90, height: 90, borderRadius: 10 }}
          />
        </View>

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
              name= {hidePassword ? 'eye-outline': 'eye-off-outline'}
              type="ionicon"
              color='#9fa0af'
              size={20}
              onPress={()=> setHidePassword(!hidePassword)}
            />
          </View>

          
        </View>
        <View style={styles.inputContainer}>
          <Button
            title="Iniciar sesion"
            buttonStyle={{
              backgroundColor: '#66bfc5',
              borderRadius: 10,
              height: 50
            }}
            titleStyle={{
              fontFamily: 'Poppins-SemiBold'
            }}
            onPress={() =>{handleLogin()}}
            loading={loading}
          />
        </View>
        <View style={styles.contentLinks}>
          <Button
            title="Registrate"
            onPress={() => navigation.navigate('Register')}
            type="clear"
            titleStyle={{
              color: '#86889c',
              fontFamily: 'Poppins-SemiBold'
            }}
          />
          <Text style={{ marginHorizontal: 2 }}></Text>
          <Button
            title="Olvide contraseña"
            onPress={() => navigation.navigate('VerifyEmail')}
            type="clear"
            titleStyle={{
              color: '#86889c',
              fontFamily: 'Poppins-SemiBold'
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default Login

const styles = StyleSheet.create({ 
  inputContainer:{
    width: '100%',
    paddingVertical: 8
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f6fa',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 50,
    fontFamily: 'Poppins-Medium'
  },
  label:{
    fontSize: 17,
    color: '#14193f',
    fontFamily: 'Poppins-Medium'
  },
  contentLinks:{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  inputIcon:{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f5f6fa',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 50
  },
  inputStyle: {
    flex: 1,
    height: 50,
    fontFamily: 'Poppins-Medium'
  },
})