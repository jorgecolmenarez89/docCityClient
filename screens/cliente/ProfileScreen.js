import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TextInput, Alert, Platform, PermissionsAndroid} from 'react-native';
import storage from '@react-native-firebase/storage';
import {useFocusEffect} from '@react-navigation/native';
import {Avatar, Button, BottomSheet, Icon} from '@rneui/themed';
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
  const [url, setUrl] = useState('');

  const [isVisible, setIsVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
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
    }, []),
  );

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
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        setFileData(response);
        response.assets.forEach(item => {
          const {uri} = item;
          const filename = 'avatar';
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          const path = `images/${userLoged.id}/${filename}`;
          uploadImageAndGetUrl(uploadUri, path).then(url => {
            setUrl(url);
            handleUpdateAvatar(url);
          });
        });
        setIsVisible(false);
      }
    });
  };

  const openCamera = async () => {
    const grantedcamera = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'App Camera Permission',
      message: 'App needs access to your camera ',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    const grantedstorage = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'App Camera Permission',
        message: 'App needs access to your camera ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (
      grantedcamera === PermissionsAndroid.RESULTS.GRANTED &&
      grantedstorage === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Camera & storage permission given');
      const options = {
        mediaType: 'photo', //to allow only photo to select ...no video
        saveToPhotos: true, //to store captured photo via camera to photos or else it will be stored in temp folders and will get deleted on temp clear
        includeBase64: false,
      };
      ImagePicker.launchCamera(options, res => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          alert(res.customButton);
        } else {
          const source = {uri: res.uri};
          setFileData(res);
          res.assets.forEach(item => {
            const {uri} = item;
            const filename = 'avatar';
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            const path = `images/${userLoged.id}/${filename}`;
            uploadImageAndGetUrl(uploadUri, path).then(url => {
              setUrl(url);
              handleUpdateAvatar(url);
            });
          });
          setIsVisible(false);
        }
      });
    } else {
      console.log('Camera permission denied');
    }
  };

  const handleUpdate = async () => {
    const body = {
      id: userLoged.id,
      userName: userLoged.userName,
      email: userLoged.email,
      fullName: userLoged.fullName,
      colegioMedicoId: userLoged.colegioMedicoId,
      experienceYears: userLoged.experienceYears,
      medicalSpecialityId: userLoged.medicalSpecialityId,
      sexo: sex,
      isAuthorizedDoctor: false,
      phoneNumber: phone,
      deviceToken: userLoged.deviceToken,
      geoLocation: userLoged.geoLocation,
      url,
      urlCredential: userLoged.urlCredential,
      isLocalizable: userLoged.isLocalizable ? userLoged.isLocalizable : false,
      statusDoctor: userLoged.statusDoctor,
      statusDoctorDescription: userLoged.statusDoctorDescription,
      isCompletedInfo: userLoged.isCompletedInfo,
    };
    try {
      await updateUserInfo(body);
      changeUserLoged({...userLoged, ...body});
      Alert.alert('Éxito', 'Datos actualizados correctamente');
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

  const handleUpdateAvatar = async urlRecibida => {
    //setLoading(true);
    const body = {
      ...userLoged,
      url: urlRecibida,
    };
    try {
      await updateUserInfo(body);
      changeUserLoged({...userLoged, ...body});
      //setLoading(false);
      Alert.alert('Exito', 'Avatar actualizado correctamente');
    } catch (error) {
      console.log('error', error.response.data);
      //setLoading(false);
      Alert.alert('Error', 'Ocurrio un error intente nuevamente');
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
          <Avatar
            size={100}
            rounded
            source={{
              uri: url != '' ? url : 'https://cdn-icons-png.flaticon.com/512/147/147133.png',
            }}>
            <Avatar.Accessory
              size={23}
              style={{backgroundColor: '#0b445e'}}
              onPress={() => setIsVisible(true)}
            />
          </Avatar>
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
            placeholder='Escribe tu número telefónico'
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
            raised={false}
          />
        </View>
      </View>

      <BottomSheet modalProps={{}} isVisible={isVisible}>
        <View style={{backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 20}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.titleShet}>Foto de Perfil</Text>
            <View>
              <Icon
                name={'close'}
                color={'#06060a'}
                size={27}
                type='ionicon'
                style={{marginTop: 5, marginLeft: 5}}
                onPress={() => setIsVisible(false)}
              />
            </View>
          </View>

          <View style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
            <View style={styles.itemShet}>
              <View style={styles.itemShetRound}>
                <Icon
                  name={'camera-outline'}
                  color={'#0b445e'}
                  size={27}
                  type='ionicon'
                  onPress={() => openCamera()}
                />
              </View>
              <Text style={styles.subTitleShet}>Cámara</Text>
            </View>

            <View style={styles.itemShet}>
              <View style={styles.itemShetRound}>
                <Icon
                  name={'image-outline'}
                  color={'#0b445e'}
                  size={27}
                  type='ionicon'
                  onPress={() => loadFile()}
                />
              </View>
              <Text style={styles.subTitleShet}>Galería</Text>
            </View>
          </View>
        </View>
      </BottomSheet>
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
  itemShet: {
    display: 'flex',
    width: 70,
    marginRight: 20,
    alignItems: 'center',
  },
  itemShetRound: {
    borderRadius: 50,
    borderColor: '#7d7d7d',
    borderWidth: 1,
    height: 60,
    width: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleShet: {
    fontSize: 15,
    color: '#06060a',
    fontFamily: 'Poppins-SemiBold',
  },
  subTitleShet: {
    fontSize: 14,
    color: '#06060a',
    fontFamily: 'Poppins-Regular',
  },
});
