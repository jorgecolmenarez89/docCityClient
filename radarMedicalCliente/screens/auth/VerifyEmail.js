import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import {sendUserSecurityCode} from '../../services/auth';
import { validateEmail } from '../../helpers';

function VerifyEmail({ navigation }) {

  const [email, setEmail]= useState('')
  const [userName, setUserName]= useState('')
  const [loading, setLoading] = useState(false)

  const sendEmail = async() => {
    if(userName=== '') {
      Alert.alert('Atención','Campo usuario es requerido');
    } else if (email == '') {
      Alert.alert('Atención','Campo correo electrónico es requerido');
    }else if (!validateEmail(email)) {
      Alert.alert('Atención','Formato de correo inválido');
    } else {
      setLoading(true)
      const body = {
        userName: userName,
        usedFor: 'Cambio de contraseña',
        emailSent: email
      }
      try {
        await sendUserSecurityCode(body)
        navigation.push('ResetPassword', {
          userName
        })
        setLoading(false)
      } catch (error) {
        setLoading(false)
        Alert.alert('Atención',error.response.data);
      }
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <View style={{ paddingHorizontal: 30, width: '100%' }}>
        <View style={{ display: 'flex', justifyContent: 'flex-start', flexDirection:'row', width: '100%', marginBottom: 30 }}>
          <Text style={styles.title}>Recuperar Contraseña</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            maxLength={40}
            style={styles.input}
            value={userName}
            onChangeText={(text) => setUserName(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            maxLength={40}
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Button
            title="Enviar email"
            onPress={() => sendEmail()}
            buttonStyle={{
              backgroundColor: '#66bfc5',
              borderRadius: 10,
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
            title="Volver al login"
            onPress={() => navigation.navigate('Login')}
            type="clear"
            titleStyle={{
              color: '#545573',
              fontFamily: 'Poppins-SemiBold'
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default VerifyEmail

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
    fontFamily: 'Poppins-Medium',
    height: 50
  },
  label:{
    fontSize: 17,
    color: '#15193f',
    fontFamily: 'Poppins-Medium'
  },
  contentLinks:{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 22,
    color: '#15193f',
    fontFamily: 'Poppins-SemiBold'
  }
})