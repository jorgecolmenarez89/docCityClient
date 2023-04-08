import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import {changePassword} from '../../services/auth';


function ResetPassword({ navigation, route }) {

  const [newPassword, setNewPassword]= useState('')
  const [userName, setUserName]= useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() =>{
    if (route.params?.userName) {
      setUserName(route.params.userName);
    }
  })
  const handleReset = async() => {
    if(newPassword=== '') {
      Alert.alert('Atención','Campo contraseña es requerido');
    } else if (code == '') {
      Alert.alert('Atención','Campo código es requerido');
    } else {
      setLoading(true)
      try {
        await changePassword(userName, newPassword, code)
        Alert.alert('Exito', 'Contraseña actualizada correctamente');
        setLoading(false)
        setCode(''),
        setNewPassword('');
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
          <Text style={styles.title}>Resetear Contraseña</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <TextInput
            style={styles.input}
            maxLength={40}
            onChangeText={(text) => setNewPassword(text)}
            value={newPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Código de seguridad</Text>
          <TextInput
            style={styles.input}
            maxLength={40}
            onChangeText={(text) => setCode(text)}
            value={code}
          />
        </View>
        <View style={styles.inputContainer}>
          <Button
            title="Actualizar contraseña"
            onPress={() => handleReset()}
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
      </View>
    </View>
  );
}

export default ResetPassword

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
    color: '#14193f',
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
    color: '#14193f',
    fontFamily: 'Poppins-SemiBold'
  }
})