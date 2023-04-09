import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import { Button } from '@rneui/themed';
import {getEspecialities} from '../../services/doctor/medicine';
import {getProivinces, getMunicipalitiesByProvinceId, getParroquiesByMinicipalyId} from '../../services/doctor/address'; 

function SearchScreen({navigation}) {

	const [especialidades, setEspecialidades] = useState([])
	const [estados, setEstatdos] = useState([])
	const [municipios, setMunicipios] = useState([])
	const [parroquias , setParroquias] = useState([])

	const [especialidadId, setEspecialidadId] = useState(-1)
	const [estadoId, setEstatdoId] = useState(-1)
	const [municipioId, setMunicipioId] = useState(-1)
	const [parroquiaId , setParroquiaId] = useState(-1)
	const [loading , setLoading] = useState(false)
	const [defaultValueEspecialidad, seteDefaultValueEspecialidad] = useState(null)


	useEffect(() => {
    getEspecialitiesAll();
		listProvinces();
  }, [])

  const getEspecialitiesAll = async() => {
    try {
      const {data} = await getEspecialities();
      setEspecialidades(data)
    } catch (error) {
      console.log(error)
    } 
  }

	const listProvinces = async () => {
		try {
      const {data} = await getProivinces();
      setEstatdos(data)
    } catch (error) {
      console.log(error)
    } 
	}

	const listMunicipalities = async(id) => {
		try {
      const {data} = await getMunicipalitiesByProvinceId(id);
			setMunicipios(data);
    } catch (error) {
      console.log(error)
    } 
	}

	const listParroquies = async(id) => {
		try {
      const {data} = await getParroquiesByMinicipalyId(id);
      setParroquias(data)
    } catch (error) {
      console.log(error)
    } 
	}

	const handleSearch = () => {
    navigation.navigate('Result')
	}

  return (
    <View style={styles.container}>
			<View style={styles.wrapper}> 
				<View style={{ display: 'flex', justifyContent: 'flex-start', flexDirection:'row', width: '100%', marginBottom: 30 }}>
          <Text style={styles.title}>Parámetros de Búsqueda</Text>
        </View>

				<View style={styles.inputContent}>
          <SelectDropdown
						data={estados}
						onSelect={(selectedItem, index) => {
              setEstatdoId(selectedItem.id)
							listMunicipalities(selectedItem.id)
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
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#b2b3bc'} size={16} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            defaultButtonText={'Estado o Provincia'}

						search
            searchInputStyle={styles.dropdownsearchInputStyleStyle}
            searchPlaceHolder={'Busqueda rápida'}
            searchPlaceHolderColor={'#F8F8F8'}
            renderSearchInputLeftIcon={() => {
              return <FontAwesome name={'search'} color={'#FFF'} size={18} />;
            }}

					/>
        </View>

				<View style={styles.inputContent}>
          <SelectDropdown
						data={municipios}
						onSelect={(selectedItem, index) => {
              setMunicipioId(selectedItem.id)
							listParroquies(selectedItem.id)
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
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#b2b3bc'} size={16} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            defaultButtonText={'Municipio'}
						disabled={!estadoId || estadoId == -1}
					/>
        </View>

				<View style={styles.inputContent}>
          <SelectDropdown
						data={parroquias}
						onSelect={(selectedItem, index) => {
              setParroquiaId(selectedItem.id)
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
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#b2b3bc'} size={16} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            defaultButtonText={'Parroquia'}
						disabled={!municipioId || municipioId == -1}
					/>
        </View>

				<View style={styles.inputContent}>
          <SelectDropdown
						data={especialidades}
						onSelect={(selectedItem, index) => {
              setEspecialidadId(selectedItem.id)
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
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#b2b3bc'} size={16} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            defaultButtonText={'Especialidad Médica'}
					/>
        </View>

				<View style={styles.inputContent}>
					<Button
            title="Buscar"
            onPress={() => handleSearch() }
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

export default SearchScreen

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
	dropdownsearchInputStyleStyle: {
    backgroundColor: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
	title: {
    fontSize: 22,
    color: '#14193f',
    fontFamily: 'Poppins-SemiBold'
  }
})