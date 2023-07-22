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
  Alert,
} from 'react-native';
import {Button, Icon} from '@rneui/themed';
import {RootStackParamList} from '../../config/Types';
import {AuthContext} from '../../context/AuthContext';
import {validateEmail} from '../../helpers';
import {axiosInstance} from '../../config/api';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';

type CargaListScreenProps = NativeStackScreenProps<RootStackParamList>;

function CargaAddScreen({navigation}: CargaListScreenProps) {
  const {userLoged, token} = useContext(AuthContext);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    parentUserId: '',
    username: '',
    email: '',
    password: '',
    fullName: '',
    repeatPassword: '',
    deviceToken: token,
    parentesco: '',
  });

  const [relations, setRelations] = useState([
    {id: 1, name: 'Abuelo/a'},
    {id: 2, name: 'Esposo/a'},
    {id: 3, name: 'Hermano/a'},
    {id: 4, name: 'Hijo/a'},
    {id: 5, name: 'Madre'},
    {id: 6, name: 'Padre'},
    {id: 7, name: 'Primo/a'},
    {id: 8, name: 'Sobrino/a'},
    {id: 9, name: 'Tío/a'},
  ]);

  const handleChange = (text: string, name: string) => {
    setUser({
      ...user,
      [name]: text,
    });
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
      Alert.alert('Atención', 'Formato de corre invalido');
    } else {
      const url = '/users/CreateUserChild';
      const body = {
        ...user,
        parentUserId: userLoged.id,
      };
      try {
        const response = await axiosInstance({isNode: false}).post(url, body, {
          headers: {'Content-Type': 'application/json'},
        });
        setLoading(true);
        navigation.goBack();
      } catch (error: any) {
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
          <SelectDropdown
            data={relations}
            onSelect={(selectedItem, index) => {
              setUser({...user, parentesco: selectedItem.name});
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
            defaultButtonText={'Parentesco'}
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
            title='Guardar familiar'
            onPress={() => {
              handleRegister();
            }}
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
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f6fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#7d7d7d',
    fontFamily: 'Poppins-Medium',
  },
  dropdown1BtnTxtStyle: {
    color: '#7d7d7d',
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
});

export default CargaAddScreen;
