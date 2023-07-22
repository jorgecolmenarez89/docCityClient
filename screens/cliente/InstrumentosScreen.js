import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import {Button, Image} from '@rneui/themed';

import CustomHeader from '../../components/CustomHeader';
import {AuthContext} from '../../context/AuthContext';
import {getMyGiftCare} from '../../services/user/gitfcare';
import {checkMoney} from '../../services/user/gitfcare';

const url = 'https://play.google.com/store/apps/details?id=com.veidthealth.giftcareapp&pli=1';

function InstrumentosScreen({navigation}) {
  const {userLoged} = useContext(AuthContext);
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [cardInfo, setCarInfo] = useState(null);

  const [loadingCheck, setLoadingCheck] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [reesponseGC, setResponseGC] = useState({
    success: false,
    found: 0,
    message: '',
    todoOk: false,
  });

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
    getSaldo();
  }, []);

  const getCards = async () => {
    const {data} = await getMyGiftCare(userLoged);
    setCards([]);
    setIsSearch(true);
  };

  const getSaldo = async () => {
    try {
      const response = await checkMoney(userLoged.email);
      setCarInfo(response.data);
      setResponseGC({
        success: true,
        found: response.data.balance,
        message: buildMesage(response.data.balance),
        todoOk: response.data.balance < 10 ? false : true,
      });
      setIsSearch(true);
    } catch (error) {
      console.log('error dado', error);
      if (error.response.status === 404) {
        setResponseGC({
          success: false,
          found: -400,
          message: 'No posees tarjeta GiftCare con tu cuenta de Correo, puedes:',
          todoOk: false,
        });
        setIsSearch(true);
      } else {
        setResponseGC({
          success: false,
          found: -500,
          message: 'Ha Ocurrido un error intente nuevamente',
          todoOk: false,
        });
        setIsSearch(true);
      }
    }
  };

  const tryAgain = () => {
    setLoadingCheck(true);
    getSaldo();
  };

  const buildMesage = balance => {
    if (balance === 0) {
      return 'Detectamos tu tarjeta sin embargo no posee fondos, debereas recargar el mismo desde la app GiftCare';
    } else if (balance > 0 && balance < 10) {
      return 'Detectamos tu tarjeta sin embargo no posee monto minimo para una consulta, debereas recargar el mismo desde la app GiftCare';
    } else {
      return 'Fondos suficientes, presiona continuar para realizar la busqueda';
    }
  };

  const getBackground = () => {
    if (cardInfo.balance >= 10) {
      return '#17C964';
    }
    return '#F5A524';
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
        <Text style={styles.title}>Mi Gitfcare</Text>
      </View>

      <View
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {!isSearch && <Text>Buscando...</Text>}

        {!cardInfo && isSearch && (
          <View style={styles.styleResponse}>
            <Text style={styles.textFinance}>No posees GitfCare</Text>
            <View style={{width: '100%', display: 'flex', alignItems: 'center', marginTop: 15}}>
              <Image
                source={require('../../assets/google-play.png')}
                style={{
                  height: 70,
                  width: 70,
                }}
              />
              <Button
                title='Descargar desde Play Store'
                type='clear'
                onPress={async () => {
                  await Linking.openURL(url);
                }}
              />
            </View>
          </View>
        )}

        {cardInfo && isSearch && (
          <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
            <Text style={styles.textFinance}>Resumen finaciero</Text>
            <View style={{...styles.header, backgroundColor: getBackground()}}>
              <Text style={styles.titleHeader}>Saldo: {cardInfo.balance}$</Text>
              <Text style={styles.titleHeader}>
                {cardInfo.balance >= 10
                  ? 'Si posee fondos para realizar una consulta'
                  : 'El fondo mínimo para una consulta es de 10$, debe recargar saldo'}
              </Text>
            </View>
          </View>
        )}
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
  header: {
    width: '90%',
    marginTop: 10,
    //backgroundColor: '#005d81',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    display: 'flex',
  },
  body: {
    marginTop: -30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    padding: 10,
  },
  titleHeader: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    color: '#fff',
  },
  textHeader: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#fff',
  },
  textFinance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#06060a',
  },
});
