import React, {useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MenuButton from '../../components/MenuButton'; 
import * as ImagePicker from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { Button, Image, Icon, FAB } from '@rneui/themed';
import {getEspecialities} from '../../services/doctor/medicine'; 
import { updateDoctorInfo} from '../../services/doctor/profile'; 
import { AuthContext } from '../../context/AuthContext';

const sexos = [
  'Masculino',
  'Femenino'
];

function CompleteInfoScreen({ navigation }) {

  const {userLoged, changeUserLoged} =  useContext(AuthContext)
  // const [sexo, setSexo] = useState('')
  const [identification, setIdentification] = useState('')
  const [years, setYears] = useState(0)
  const [especialidad, setEspecialidad] = useState('')
  const [fileData, setFileData] = useState(null)
  const [specialities, seteSpecialities] = useState([])
  const [defaultValueEspecialidad, seteDefaultValueEspecialidad] = useState(null)

  useEffect(() => {
    console.log(userLoged)
    getEspecialitiesAll();
    setIdentification(userLoged.colegioMedicoId)
    setYears(userLoged.experienceYears.toString())
  }, [])

  const getEspecialitiesAll = async() => {
    try {
      const {data} = await getEspecialities();
      seteSpecialities(data)
      if(userLoged.medicalSpecialityId || userLoged.medicalSpecialityId != 0){
        const find = data.find(item => item.id === userLoged.medicalSpecialityId)
        seteDefaultValueEspecialidad(find)
      }
    } catch (error) {
      console.log(error)
    } 
  }

  const loadFile = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      //console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // alert(JSON.stringify(response));s
        /*console.log('response', JSON.stringify(response));*/
        setFileData(response);
        /*response.assets.forEach(item => {
          console.log('item', item.uri)
        })*/
      }
    });
  }


  const guardar = async() => {
    let userToken = await AsyncStorage.getItem('userToken');
    const userData = JSON.parse(userToken);
    console.log('userdata', userData)
    if(especialidad == '') {
      Alert.alert('Atención','Campo Especialidad es obligatorio');
    } else if(identification == ''){
      Alert.alert('Atención','Campo Credencial es obligatorio');
    } else if (years == 0 || !years) {
      Alert.alert('Atención','Campo Años de experiencia es obligatorio');
    } else {
      const body = {
        userName: userData.userName,
        colegioMedicoId: identification,
        experienceYears: years,
        medicalSpecialityId: especialidad,
        isAuthorizedDoctor: false,
        healthCenters: []
      }
      try {
        const response = await updateDoctorInfo(body)
        Alert.alert('Exito','Datos Actualizados');
        const newDataUser = {...userLoged,
          colegioMedicoId: identification,
          experienceYears: years,
          medicalSpecialityId: especialidad
        }
        refreshUser(newDataUser)
      } catch (error) {
        console.log('axios error', error.response.data)
        Alert.alert('Error','Error al intentar guardar los datos');
      }
      
    }
  }

  const refreshUser = (data) => {
    changeUserLoged(data)
  }

  const activateUser = async () => {
    try {
      const body = {
        userName: userLoged.userName,
        colegioMedicoId: userLoged.colegioMedicoId,
        experienceYears: userLoged.experienceYears,
        medicalSpecialityId: userLoged.medicalSpecialityId,
        isAuthorizedDoctor: true,
        healthCenters: []
      }
      const newDataUser = {
        ...userLoged,
        isAuthorizedDoctor: true
      }
      await updateDoctorInfo(body)
      refreshUser(newDataUser)
      alert('todo ok')
    } catch (error) {
      console.log('axios error', error.response.data)
      Alert.alert('Error','Error al intentar guardar los datos');
    }
  } 

  return (
    <View style={{ flex: 1}}>
      <View style={{ height: 50 }}>
        <MenuButton 
          iconName="menu-outline"
          onPress={() => {navigation.toggleDrawer()}}
          style={{
            position: 'absolute',
            top: 10,
            left: 20
          }}
        />
      </View>
      <View style={styles.container}>

        <View style={styles.headerTitleContent}>
          <Text style={styles.headerTitle}>
            Bienvenido a APP Name debes completar tus datos para validarlos y poder operar como Médico en  nusetro sistema
          </Text>
        </View>

        <View style={styles.inputContent}>
          
          <SelectDropdown
						data={specialities}
            defaultValue={defaultValueEspecialidad}
						onSelect={(selectedItem, index) => {
              setEspecialidad(selectedItem.id)
						}}
						buttonTextAfterSelection={(selectedItem, index) => {
							return selectedItem.name
						}}
						rowTextForSelection={(item, index) => {
							return item.name
						}}
						buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            defaultButtonText={'Indiquenos su Especialidad'}
					/>

        </View>

        <View style={styles.inputContent}>
          <FloatingLabelInput
            label={'Credencial Médica'}
            value={identification}
            onChangeText={value => setIdentification(value)}
          />
        </View>

        <View style={styles.inputContent}>
          <View style={{ width: 150 }}>
            <Button  
              buttonStyle={{
                backgroundColor: '#66bfc5',
                borderRadius: 10,
                height: 50
              }}
              titleStyle={{fontSize: 14  }}
              onPress={() => loadFile ()}
            >
              Subir Credencial
              <Icon name="upload-file" color="white" />
            </Button>
          </View>
        </View>
        
        {fileData &&
          fileData.assets.map((url, i) => (
          <View style={styles.imageContainer} key={'img-' +i }>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={styles.image}
              source={{
                uri: url.uri
              }}
            />
          </View>
        ))}
        
        <View style={styles.inputContent}>
          <FloatingLabelInput
            label={'Años de experiencia'}
            value={years}
            onChangeText={value => setYears(value)}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        <View style={styles.inputContent}>
          <Button title="Guardar Datos" type="solid" 
            buttonStyle={{
              backgroundColor: '#66bfc5',
              borderRadius: 10,
              height: 50
            }}
            onPress={guardar}
          />
        </View>
      </View>

      <FAB
        visible={true}
        upperCase
        icon={{ name: 'checkmark-outline', color: 'white', type: 'ionicon' }} 
        placement="left"
        onPress={() => activateUser()}
        color="#66bfc5"
      />

    </View>
  );
}

export default CompleteInfoScreen

const styles = StyleSheet.create({ 
  container:{
    width: '100%',
    paddingHorizontal: 20
  },
  input: {
    width: '100%',
    backgroundColor: '#F6F5F5',
    borderRadius: 6
  },
  label:{
    fontSize: 17
  },
  contentLinks:{
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  inputContent: {
    width: '100%',
		marginBottom: 15
  },
  headerTitleContent: {
    display: 'flex',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    color: '#66bfc5',
    fontFamily: 'Poppins-SemiBold'
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  image: {
    width: '100%',
    height: 180,
    borderColor: 'black',
    marginHorizontal: 3
  },
  imageContainer: {
    height: 200
  }
})