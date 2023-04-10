import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import {Avatar, Button } from '@rneui/themed';
import * as ImagePicker from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';

const sexos = [
  'Masculino',
  'Femenino'
];

function ProfileScreen() {

  const [fileData, setFileData] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [loading, setLoading] = useState(false);

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
  
  const handleUpdate = () => {

  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}> 
				<View style={{ display: 'flex', justifyContent: 'flex-start', flexDirection:'row', width: '100%', marginBottom: 30 }}>
          <Text style={styles.title}>Editar Perfil</Text>
        </View>
        <View style={styles.contentImage}>
          {!fileData &&
            <Avatar
              size={100}
              rounded
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/147/147133.png' }}
            >
              <Avatar.Accessory size={23} 
                style={{ backgroundColor: '#66bfc5' }}
                onPress={() => loadFile()}
              />
            </Avatar>
          }

          {fileData &&
            fileData.assets.map((url, i) => (
            <View style={styles.imageContainer} key={'img-' +i }>
              <Avatar
                size={100}
                rounded
                source={{
                  uri: url.uri
                }}
              >
                <Avatar.Accessory size={23} 
                  style={{ backgroundColor: '#66bfc5' }}
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
          />
        </View>

        <View style={styles.inputContent}>
          <Text style={styles.label}>Número de teléfono</Text>
          <TextInput
            style={styles.input}
            maxLength={11}
            onChangeText={text => setPhone(text)}
            value={phone}
            placeholder='04240000000'
            placeholderTextColor={'#35385b'}
          />
        </View>

        <View style={styles.inputContent}>
          <Text style={styles.label}>Sexo</Text>
          <SelectDropdown
						data={sexos}
						onSelect={(selectedItem, index) => {
              setSex(selectedItem)
						}}
						buttonTextAfterSelection={(selectedItem, index) => {
							return selectedItem
						}}
						rowTextForSelection={(item, index) => {
							return item
						}}
						buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#9fa0af'} size={16} />;
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
            title="Actualizar"
            onPress={() => handleUpdate() }
            buttonStyle={{
              backgroundColor: '#66bfc5',
              borderRadius: 10,
              height: 50,
							marginTop: 10
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

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: '#ffffff'
  },
	wrapper: {
		paddingHorizontal: 30,
		marginTop: 50
	},
	inputContent: {
    width: '100%',
		marginBottom: 12
  },
  title: {
    fontSize: 22,
    color: '#15193f',
    fontFamily: 'Poppins-SemiBold'
  },
  contentImage:{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#f5f6fa',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Medium'
  },
  label:{
    fontSize: 15,
    color: '#15193f',
    fontFamily: 'Poppins-SemiBold'
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 6,
		shadowColor: '#000',
		shadowOffset:{
				width: 0,
				height: 3
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6
  },
  dropdown1BtnTxtStyle: {color: '#83859a', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
})