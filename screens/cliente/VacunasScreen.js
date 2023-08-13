import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, FlatList, Modal, TextInput, Alert} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {FAB, Icon, Button} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {AuthContext} from '../../context/AuthContext';
import CustomHeader from '../../components/CustomHeader';
import {getAllVacunas} from '../../services/user/vacunas';

function VacunasScreen({navigation, route}) {
  const {userLoged} = useContext(AuthContext);
  const [vacunas, setVacunas] = useState([]);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idEditar, setIdEditar] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    createdAt: '',
  });
  const [date, setDate] = useState(new Date());
  const [refresh, setRefresh] = useState(false);
  const [confirm, setConfrim] = useState(false);

  const {parent} = route.params;

  const getVacunas = async () => {
    setRefresh(true);
    const {data} = await getAllVacunas(userLoged.id);
    setVacunas(data);
    setRefresh(false);
  };

  useEffect(() => {
    getVacunas();
    const subscriber = firestore()
      .collection('vacunas')
      .where('userId', '==', userLoged.id)
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          getVacunas();
        });
      });
  }, []);

  const renderItem = ({item, index}) => (
    <View style={styles.item}>
      <View style={styles.row}>
        <View style={styles.contentName}>
          <Text style={styles.textName}>{item.name}</Text>
          <Text style={styles.textDate}>
            Colocada: {moment(item.createdAt).format('DD-MM-YYYY')}
          </Text>
        </View>
        <View style={styles.contentDate}>
          <Icon
            name='create-outline'
            type='ionicon'
            color='#0b445e'
            size={30}
            onPress={() => edit(item)}
          />
          <Icon
            name='trash-outline'
            type='ionicon'
            color='#0b445e'
            size={30}
            onPress={() => confirmDelete(item)}
          />
        </View>
      </View>
    </View>
  );

  const handleChange = (text, name) => {
    setFormData({
      ...formData,
      [name]: text,
    });
  };

  const edit = item => {
    setIdEditar(item.id);
    setIsEdit(true);
    setOpenModal(true);
    setFormData(item);
    setDate(new Date(moment(item.createdAt)));
  };

  const add = () => {
    setFormData({
      name: '',
      createdAt: '',
    });
    setDate(new Date());
    setIdEditar('');
    setIsEdit(false);
    setOpenModal(true);
  };

  const confirmDelete = item => {
    setIdEditar(item.id);
    setConfrim(true);
  };

  const confirmar = () => {
    if (formData.name === '') {
      Alert.alert('Atención', 'Campo Nombre es obligatorio');
    } else if (!date) {
      Alert.alert('Atención', 'Campo Fecha es obligatorio');
    } else {
      setLoading(true);
      if (isEdit) {
        updateVacuna();
      } else {
        addVacuna();
      }
    }
  };

  const addVacuna = async () => {
    try {
      firestore()
        .collection('vacunas')
        .add({
          name: formData.name,
          userId: userLoged.id,
          createdAt: moment(date).format('YYYY-DD-MM HH:mm:ss'),
        });
      setLoading(false);
      clear();
    } catch (error) {
      console.log('error al add', error);
    }
  };

  const updateVacuna = async () => {
    try {
      firestore()
        .collection('vacunas')
        .doc(idEditar)
        .update({
          name: formData.name,
          userId: userLoged.id,
          createdAt: moment(date).format('YYYY-DD-MM HH:mm:ss'),
        });
      setLoading(false);
      clear();
    } catch (error) {
      console.log('error al actualizar', error);
    }
  };

  const deleteVacuna = async () => {
    try {
      firestore().collection('vacunas').doc(idEditar).delete();
      clear();
    } catch (error) {
      console.log('error al eliminar', error);
    }
  };

  const clear = () => {
    setOpenModal(false);
    setConfrim(false);
    setIdEditar('');
    setIsEdit(false);
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
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginBottom: 10,
        }}>
        <Text style={styles.title}>Mis Vacunas</Text>
      </View>
      <View style={{width: '100%', flex: 1, paddingHorizontal: 10}}>
        <FlatList
          containerStyle={styles.listContainer}
          data={vacunas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{height: 5}}></View>}
          refreshing={refresh}
          onRefresh={() => {
            getVacunas();
          }}
        />
        <FAB
          onPress={() => add()}
          placement='right'
          icon={{name: 'add', color: 'white'}}
          color='#0b445e'
        />
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          clear();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{display: 'flex', alignItems: 'flex-end', width: '100%'}}>
              <Icon
                type='ionicon'
                name='close-outline'
                color='#0b445e'
                onPress={() => {
                  clear();
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                maxLength={40}
                style={styles.input}
                onChangeText={text => handleChange(text, 'name')}
                value={formData.name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de colocación</Text>
              <DatePicker date={date} onDateChange={setDate} mode='date' />
            </View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Button
                  raised={false}
                  title={isEdit ? 'Actualizar' : 'Guardar'}
                  buttonStyle={{
                    backgroundColor: '#0b445e',
                    borderRadius: 30,
                    height: 40,
                    marginRight: 10,
                    paddingHorizontal: 20,
                  }}
                  titleStyle={{
                    fontFamily: 'Poppins-SemiBold',
                  }}
                  onPress={() => {
                    confirmar();
                  }}
                  loading={loading}
                />
                <Button
                  raised={false}
                  title='Cancelar'
                  buttonStyle={{
                    backgroundColor: '#66bfc5',
                    borderRadius: 30,
                    height: 40,
                    paddingHorizontal: 20,
                  }}
                  titleStyle={{
                    fontFamily: 'Poppins-SemiBold',
                  }}
                  onPress={() => clear()}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType='slide'
        transparent={true}
        visible={confirm}
        onRequestClose={() => {
          clear();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{display: 'flex', alignItems: 'flex-end', width: '100%'}}>
              <Icon
                type='ionicon'
                name='close-outline'
                color='#0b445e'
                onPress={() => {
                  clear();
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Esta Seguro de Eliminar La Vacuna ?</Text>
            </View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Button
                  raised={false}
                  title={isEdit ? 'Actualizar' : 'Guardar'}
                  buttonStyle={{
                    backgroundColor: '#0b445e',
                    borderRadius: 30,
                    height: 40,
                    marginRight: 10,
                    paddingHorizontal: 20,
                  }}
                  titleStyle={{
                    fontFamily: 'Poppins-SemiBold',
                  }}
                  onPress={() => {
                    deleteVacuna();
                  }}
                  loading={loading}
                />
                <Button
                  raised={false}
                  title='Cancelar'
                  buttonStyle={{
                    backgroundColor: '#66bfc5',
                    borderRadius: 30,
                    height: 40,
                    paddingHorizontal: 20,
                  }}
                  titleStyle={{
                    fontFamily: 'Poppins-SemiBold',
                  }}
                  onPress={() => clear()}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default VacunasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
  },
  title: {
    color: '#393738',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  contentName: {
    width: '70%',
  },
  textName: {
    color: '#393738',
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
  },
  contentDate: {
    width: '30%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textDate: {
    color: '#101010',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  item: {
    backgroundColor: '#d5d6d7',
    height: 70,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    paddingVertical: 8,
  },
  input: {
    width: '100%',
    color: '#000000',
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    fontFamily: 'Poppins-Medium',
    borderWidth: 2,
    borderColor: '#7d7d7d',
  },
  label: {
    fontSize: 17,
    color: '#06060a',
    fontFamily: 'Poppins-Medium',
  },
});
