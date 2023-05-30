import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TextInput, Alert, Platform} from 'react-native';
import storage from '@react-native-firebase/storage';
import {Avatar, Button, Image} from '@rneui/themed';
import * as ImagePicker from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import {AuthContext} from '../../context/AuthContext';
import {updateUserInfo, formatBodyUser} from '../../services/doctor/profile';
import CustomHeader from '../../components/CustomHeader';

const sexos = ['Masculino', 'Femenino'];

function ProfileScreen({navigation}) {
  const {changeUserLoged, userLoged} = useContext(AuthContext);

  const [fileData, setFileData] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [loading, setLoading] = useState(false);
  const [defaultSex, setDefaultSex] = useState('');
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (userLoged.fullName) setFullName(userLoged.fullName);
    if (userLoged.phoneNumber) setPhone(userLoged.phoneNumber);
    if (userLoged.sexo) {
      setDefaultSex(userLoged.sexo);
      setSex(userLoged.sexo);
    }
    if (userLoged.url && userLoged.url != '' && userLoged.url != null) {
      setFileData({assets: [{uri: userLoged.url}]});
      setUrl(userLoged.url);
    }
  }, []);

  const loadFile = () => {
    let options = {
      title: 'Select Image',
      customButtons: [{name: 'customOptionKey', title: 'Choose Photo from Custom Option'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      //console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // alert(JSON.stringify(response));s
        /*console.log('response', JSON.stringify(response));*/
        setFileData(response);
        response.assets.forEach(item => {
          console.log('item', item.uri);
          const {uri} = item;
          const filename = 'avatar';
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          const path = `images/${userLoged.id}/${filename}`;
          uploadImageAndGetUrl(uploadUri, path).then(url => {
            setUrl(url);
          });
        });
      }
    });
  };

  const handleUpdate = async () => {
    const body = {
      ...userLoged,
      userName: userLoged.userName,
      sexo: sex,
      phoneNumber: phone,
      url,
    };
    const formatBody = formatBodyUser(body);
    console.log('formatBody', formatBody);
    try {
      await updateUserInfo(formatBody);
      changeUserLoged(formatBody);
      Alert.alert('Exito', 'Datos actualizados correctamente');
    } catch (error) {
      console.log('error', error);
      Alert.alert('Error', 'Ocurrio un error intente nuevamente');
    }
  };

  const uploadImageAndGetUrl = async (localUri, firebasePath) => {
    try {
      const imageRef = storage().ref(firebasePath);
      await imageRef.putFile(localUri, {contentType: 'image/jpg'});
      const url = await imageRef.getDownloadURL();
      return url;
    } catch (err) {
      Alert.alert(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 10, marginLeft: 20}}>
        <CustomHeader
          iconColor='#0b445e'
          iconName='arrow-back'
          onPressIcon={() => navigation.goBack()}
        />
      </View>
      <View style={styles.wrapper}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            width: '100%',
            marginBottom: 20,
          }}>
          <Text style={styles.title}>Editar Perfil</Text>
        </View>
        <View style={styles.contentImage}>
          {!fileData && (
            <Avatar
              size={100}
              rounded
              source={{uri: 'https://cdn-icons-png.flaticon.com/512/147/147133.png'}}>
              <Avatar.Accessory
                size={23}
                style={{backgroundColor: '#0b445e'}}
                onPress={() => loadFile()}
              />
            </Avatar>
          )}

          {fileData &&
            fileData.assets.map((url, i) => (
              <View style={styles.imageContainer} key={'img-' + i}>
                <Avatar
                  size={100}
                  rounded
                  source={{
                    uri: url.uri,
                  }}>
                  <Avatar.Accessory
                    size={23}
                    style={{backgroundColor: '#66bfc5'}}
                    onPress={() => loadFile()}
                  />
                </Avatar>
              </View>
            ))}
        </View>

        <View style={styles.inputContent}>
          <Text style={styles.label}>Nombre y Apellido</Text>
          <TextInput
            style={styles.input}
            maxLength={40}
            onChangeText={text => setFullName(text)}
            value={fullName}
            placeholder='Jhon Doe'
            placeholderTextColor={'#35385b'}
            readOnly
          />
        </View>

        <View style={styles.inputContent}>
          <Text style={styles.label}>Número de teléfono</Text>
          <TextInput
            style={styles.input}
            maxLength={11}
            onChangeText={text => setPhone(text)}
            value={phone}
            placeholder='Escribe tu numero teléfonico'
            placeholderTextColor={'#35385b'}
          />
        </View>

        <View style={styles.inputContent}>
          <Text style={styles.label}>Sexo</Text>
          <SelectDropdown
            defaultValue={defaultSex}
            data={sexos}
            onSelect={(selectedItem, index) => {
              setSex(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
              return (
                <FontAwesome
                  name={isOpened ? 'chevron-up' : 'chevron-down'}
                  color={'#7d7d7d'}
                  size={16}
                />
              );
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            defaultButtonText={'Seleccione...'}
          />
        </View>

        <View style={styles.inputContent}>
          <Button
            title='Actualizar'
            onPress={() => handleUpdate()}
            buttonStyle={{
              backgroundColor: '#0b445e',
              borderRadius: 30,
              height: 50,
              marginTop: 10,
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

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fc',
  },
  wrapper: {
    paddingHorizontal: 30,
    marginTop: 10,
  },
  inputContent: {
    width: '100%',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    color: '#15193f',
    fontFamily: 'Poppins-SemiBold',
  },
  contentImage: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
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
  },
  label: {
    fontSize: 15,
    color: '#06060a',
    fontFamily: 'Poppins-SemiBold',
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7d7d7d',
  },
  dropdown1BtnTxtStyle: {color: '#83859a', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  imageBox: {
    width: 300,
    height: 300,
  },
});
