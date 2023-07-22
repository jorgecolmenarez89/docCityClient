import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Image} from '@rneui/themed';
import CustomHeader from '../../components/CustomHeader';
import {AuthContext} from '../../context/AuthContext';
import {requestFinish} from '../../services/doctor/request';
import moment from 'moment';

function ConsultasScreen({navigation}) {
  const {userLoged} = useContext(AuthContext);
  const [consultations, setConsultations] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const {data} = await requestFinish(userLoged.id);
    setIsSearch(true);
    setConsultations(data.data);
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ConsultasDeatilS', {
          id: item.id,
        });
      }}
      style={styles.itemList}>
      <View style={styles.content}>
        <View style={styles.iconContent}>
          <Image
            source={{uri: item.doctorUser.url}}
            style={{
              width: 70,
              height: 70,
              borderRadius: 6,
            }}
          />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.title}>{item.doctorUser.fullName}</Text>
          <View style={styles.optionsContent}>
            <Text style={styles.text}>{item.doctorUser.speciality.Name}</Text>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.textRating}>{moment(item.createdAt).format('MM/DD/YYYY')}</Text>
            </View>
          </View>
        </View>
        <View style={{flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
          <Text style={{color: '#06060a', fontFamily: 'Poppins-SemiBold', marginRight: 10}}>
            Ver
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{marginTop: 10, marginLeft: 20}}>
        <CustomHeader
          iconColor='#0b445e'
          iconName='arrow-back'
          onPressIcon={() => navigation.popToTop()}
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
        <Text style={styles.title}>Mis Consultas</Text>
      </View>
      {consultations.length == 0 && isSearch && (
        <View style={styles.notFoundView}>
          <Text style={styles.notFoundText}>
            {userLoged.fullName}, Aún no ha realizado consultas médicas
          </Text>
        </View>
      )}
      <View style={{width: '100%', paddingHorizontal: 10}}>
        <FlatList
          containerStyle={styles.listContainer}
          data={consultations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{height: 5}}></View>}
        />
      </View>
    </View>
  );
}

export default ConsultasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundView: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    with: '100%',
    paddingHorizontal: 20,
  },
  notFoundText: {
    fontSize: 15,
    color: '#06060a',
    fontFamily: 'Poppins-SemiBold',
  },
  listContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#06060a',
    fontFamily: 'Poppins-SemiBold',
  },
  itemList: {
    backgroundColor: '#d5d6d7',
    padding: 10,
    borderRadius: 10,
    minHeight: 80,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconContent: {
    marginRight: 10,
    backgroundColor: '#999a9b',
    borderRadius: 6,
    width: 70,
    height: 70,
  },
  infoContent: {
    display: 'flex',
  },
  title: {
    color: '#393738',
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
  },
  optionsContent: {
    display: 'flex',
  },
  text: {
    color: '#979798',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  textRating: {
    color: '#979798',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});
