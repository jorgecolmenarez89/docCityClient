import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Button, Icon} from '@rneui/themed';

import CustomHeader from '../../components/CustomHeader';
import {AuthContext} from '../../context/AuthContext';
import {getMyGiftCare} from '../../services/user/gitfcare';

function InstrumentosScreen({navigation}) {
  const {userLoged} = useContext(AuthContext);
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);

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
              <Text style={styles.textRating}>Fecha</Text>
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

  useEffect(() => {
    getCards();
  }, []);

  const getCards = async () => {
    const {data} = await getMyGiftCare(userLoged);
    setCards([]);
    setIsSearch(true);
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
        <Text style={styles.title}>Mis Gitfcare</Text>
      </View>
      {cards.length == 0 && isSearch && (
        <View style={styles.notFoundView}>
          <Text style={styles.notFoundText}>
            {userLoged.fullName}, Aún no posee ninguna tarjeta
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              raised={false}
              title='Generar GiftCare'
              buttonStyle={{
                backgroundColor: '#0b445e',
                borderRadius: 30,
                height: 50,
              }}
              titleStyle={{
                fontFamily: 'Poppins-SemiBold',
              }}
              onPress={() => {}}
              loading={loading}
            />
          </View>
        </View>
      )}
      <View style={{width: '100%', paddingHorizontal: 10}}>
        <FlatList
          containerStyle={styles.listContainer}
          data={cards}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{height: 5}}></View>}
        />
      </View>
    </View>
  );
}

export default InstrumentosScreen;

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
  buttonContainer: {
    width: '80%',
    paddingVertical: 15,
  },
});
