import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import MaskInput, {Masks, useMaskedInputProps} from 'react-native-mask-input';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../../context/AuthContext';
import {Button, Icon} from '@rneui/themed';
import {validateEmail} from '../../helpers';
import {axiosInstance} from '../../config/api';

function Register({navigation}) {
  const {changeUserLoged, token} = useContext(AuthContext);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    userId: '',
    username: '',
    email: '',
    password: '',
    fullName: '',
    repeatPassword: '',
    deviceToken: token,
    sexo: '',
    age: 0,
    birthDate: new Date(),
  });

  const [sexos, setSexos] = useState([
    {id: 'Masculino', name: 'Masculino'},
    {id: 'Femenino', name: 'Femenino'},
  ]);
  const [date, setDate] = useState('');

  const handleChange = (text, name) => {
    setUser({
      ...user,
      [name]: text,
    });
  };

  const setFechaN = value => {
    console.log(value);
  };

  const handleRegister = async () => {
    if (user.username === '') {
      Alert.alert('Atención', 'Campo usuario es requerido');
    } else if (user.email == '') {
      Alert.alert('Atención', 'Campo correo electrónico es requerido');
    } else if (user.fullName == '') {
      Alert.alert('Atención', 'Campo Nombres es requerido');
    } else if (user.password == '') {
      Alert.alert('Atención', 'Campo Contraseña es requerido');
    } else if (user.repeatPassword == '') {
      Alert.alert('Atención', 'Campo Repetir contraseña es requerido');
    } else if (user.repeatPassword != user.password) {
      Alert.alert('Atención', 'Las contraseñas son distintas');
    } else if (!validateEmail(user.email)) {
      Alert.alert('Atención', 'Formato de correo invalido');
    } else if (user.sexo == '') {
      Alert.alert('Atención', 'Campo Sexo es requerido');
    } else if (date == '') {
      Alert.alert('Atención', 'Campo Fecha de Nacimiento es requerido');
    } else {
      setLoading(true);
      const url = '/users/CreateUser';
      const parts = date.split('/');
      const dateFormat = `${parts[2]}-${parts[1]}-${parts[0]}`;
      const fecha = new Date(dateFormat);
      const xmas = new Date();
      const year = fecha.getYear();
      const currentYear = xmas.getYear();
      const age = currentYear - year;
      const body = {...user, birthDate: fecha.toISOString(), age};
      try {
        const response = await axiosInstance({isNode: false}).post(url, body, {
          headers: {'Content-Type': 'application/json'},
        });
        changeUserLoged(response.data);
      } catch (error) {
        console.log('error', error);
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
    <KeyboardAvoidingView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <View style={{flex: 1, paddingHorizontal: 30, width: '100%'}}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              width: '100%',
              marginBottom: 20,
            }}>
            <Text style={styles.title}>Registro</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              maxLength={40}
              style={styles.input}
              onChangeText={text => handleChange(text.trim(), 'username')}
              value={user.username}
              placeholder='Nombre de usuario'
              placeholderTextColor={'#7d7d7d'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              maxLength={40}
              style={styles.input}
              onChangeText={text => handleChange(text.trim(), 'email')}
              value={user.email}
              placeholder='Correo electrónico'
              placeholderTextColor={'#7d7d7d'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              maxLength={40}
              onChangeText={text => handleChange(text, 'fullName')}
              value={user.fullName}
              placeholder='Nombre y apellido'
              placeholderTextColor={'#7d7d7d'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputIcon}>
              <TextInput
                style={styles.inputStyle}
                maxLength={40}
                onChangeText={text => handleChange(text.trim(), 'password')}
                value={user.password}
                secureTextEntry={hidePassword}
                placeholder='********'
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
            <Text style={styles.label}>Repita contraseña</Text>
            <View style={styles.inputIcon}>
              <TextInput
                style={styles.inputStyle}
                maxLength={40}
                onChangeText={text => handleChange(text.trim(), 'repeatPassword')}
                value={user.repeatPassword}
                secureTextEntry={hideRepeatPassword}
                placeholder='********'
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
            <Text style={styles.label}>Sexo</Text>
            <SelectDropdown
              data={sexos}
              onSelect={(selectedItem, index) => {
                setUser({...user, sexo: selectedItem.id});
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name;
              }}
              rowTextForSelection={(item, index) => {
                return item.name;
              }}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return (
                  <FontAwesome
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#9fa0af'}
                    size={16}
                  />
                );
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              defaultButtonText={'Seleccione'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <MaskInput
              value={date}
              style={styles.input}
              placeholder='DD/MM/AAAA'
              keyboardType='numeric'
              onChangeText={(masked, unmasked) => {
                setDate(masked);
              }}
              mask={Masks.DATE_DDMMYYYY}
            />
          </View>
          <View style={styles.inputContainer}>
            <Button
              raised={false}
              title='Crear cuenta'
              onPress={() => handleRegister()}
              buttonStyle={{
                backgroundColor: '#0b445e',
                borderRadius: 30,
                height: 50,
                marginTop: 8,
              }}
              titleStyle={{
                fontFamily: 'Poppins-SemiBold',
              }}
              loading={loading}
            />
          </View>
          <View style={styles.inputContainer}>
            <Button
              title='Ya tengo cuenta'
              onPress={() => navigation.navigate('Login')}
              type='clear'
              titleStyle={{
                color: '#4c71c9',
                fontFamily: 'Poppins-SemiBold',
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Register;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f6f7fc',
    paddingTop: 25,
  },
  inputContainer: {
    width: '100%',
    paddingBottom: 5,
  },
  input: {
    height: 45,
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
    fontSize: 14,
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
    height: 45,
  },
  inputStyle: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    height: 45,
    color: '#000000',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    color: '#06060a',
    fontFamily: 'Poppins-SemiBold',
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 45,
    backgroundColor: '#f6f7fc',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7d7d7d',
  },
  dropdown1BtnTxtStyle: {
    color: '#7d7d7d',
    textAlign: 'left',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dropdownsearchInputStyleStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
});
