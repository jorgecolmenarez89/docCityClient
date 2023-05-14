import React, {useContext, useState} from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Button, Icon  } from '@rneui/themed';
import { validateEmail } from '../../helpers';
import {axiosInstance} from '../../config/api';

function Register({ navigation }) {

  const {changeUserLoged} =  useContext(AuthContext)
  const [hidePassword, setHidePassword] = useState(true)
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true)
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    repeatPassword: ''
  })

  const handleChange = (text, name) => {
    setUser({
      ...user,
      [name]: text
    })
  }

  const handleRegister = async() => {

    if(user.username === '') {
      Alert.alert('Atención','Campo usuario es requerido');
    } else if (user.email == '') {
      Alert.alert('Atención','Campo correo electrónico es requerido');
    }else if (user.fullName =='') {
      Alert.alert('Atención','Campo Nombres es requerido');
    }else if (user.password == '') {
      Alert.alert('Atención','Campo Contraseña es requerido');
    }else if (user.repeatPassword == '') {
      Alert.alert('Atención','Campo Repetir contraseña es requerido');
    }else if (user.repeatPassword != user.password) {
      Alert.alert('Atención','Las contraseñas son distintas');
    }else if (!validateEmail(user.email)) {
      Alert.alert('Atención','Formato de corre invalido');
    } else {
      //register(user)
      const url = `/users/CreateUser`;
      try {
        const response =  await axiosInstance.post(url, user, {
          headers: {'Content-Type': 'application/json'}
        })
        setLoading(true);
        changeUserLoged(response.data)
      } catch (error) {
        console.log('error', error)
        if(error.response.status === 400){
          setLoading(false);
          Alert.alert('Atención',error.response.data);
        } else {
          Alert.alert('Error','Ha Ocurrido un error intente nuevamente');
          setLoading(false);
        }
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7fc', paddingTop: 50  }}>
      <View style={{ flex: 1, paddingHorizontal: 30, width: '100%' }}>
        <View style={{ display: 'flex', justifyContent: 'flex-start', flexDirection:'row', width: '100%', marginBottom: 30 }}>
          <Text style={styles.title}>Registro</Text>
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
              name= {hidePassword ? 'eye-outline': 'eye-off-outline'}
              type="ionicon"
              color='#7d7d7d'
              size={20}
              onPress={()=> setHidePassword(!hidePassword)}
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
              name= {hideRepeatPassword ? 'eye-outline': 'eye-off-outline'}
              type="ionicon"
              color='#7d7d7d'
              size={20}
              onPress={()=> setHideRepeatPassword(!hideRepeatPassword)}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Button
            title="Crear cuenta"
            onPress={() => handleRegister() }
            buttonStyle={{
              backgroundColor: '#0b445e',
              borderRadius: 30,
              height: 50
            }}
            titleStyle={{
              fontFamily: 'Poppins-SemiBold'
            }}
            loading={loading}
          />
        </View>
        <View style={styles.inputContainer}>
          <Button
              title="Ya tengo cuenta"
              onPress={() => navigation.navigate('Login')}
              type="clear"
              titleStyle={{
                color: '#4c71c9',
                fontFamily: 'Poppins-SemiBold'
              }}
            />
        </View>
      </View>
    </View>
  );
}

export default Register;

const styles = StyleSheet.create({ 
  inputContainer:{
    width: '100%',
    paddingVertical: 8
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7d7d7d',
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Medium'
  },
  label:{
    fontSize: 17,
    color: '#15193f',
    fontFamily: 'Poppins-Medium'
  },
  contentLinks:{
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  inputIcon:{
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
    height: 50
  },
  inputStyle: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    height: 50
  },
  title: {
    fontSize: 22,
    color: '#06060a',
    fontFamily: 'Poppins-SemiBold'
  }
})