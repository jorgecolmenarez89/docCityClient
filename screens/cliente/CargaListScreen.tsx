import React, {useEffect, useState, useRef, useContext} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, Text, FlatList, TouchableHighlight, RefreshControl, StyleSheet} from 'react-native';
import {Button} from '@rneui/themed';
import {RootStackParamList} from '../../config/Types';
import Carga from '../../models/Carga';
import {getCargas} from '../../services/user/carga';
import Relative from '../../components/home/Relative';
import {AuthContext} from '../../context/AuthContext';

type CargaListScreenProps = NativeStackScreenProps<RootStackParamList>;

function CargaListScreen({navigation}: CargaListScreenProps) {
  const {userLoged} = useContext(AuthContext);
  const [relatives, setRelatives] = useState<Carga[]>([]);
  const listCargas = useRef<FlatList<Carga>>(null);

  useEffect(() => {
    getRelatives();
  }, []);

  const getRelatives = () => {
    /*try {
			const data: Carga[] = await getCargas();
			console.log('data', data)
		} catch (error) {
			console.log(error)
		}*/
    const data: Carga[] = getCargas();
    setRelatives(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comencemos Agregando tus Familiares</Text>
      </View>

      <View style={styles.contentButton}>
        <View style={styles.contentButtonItem}>
          <Button
            raised={false}
            title='Agregar nuevo'
            buttonStyle={{
              backgroundColor: '#0b445e',
              borderRadius: 30,
              height: 50,
            }}
            titleStyle={{
              fontFamily: 'Poppins-Bold',
              fontSize: 17,
            }}
            onPress={() => navigation.navigate('CargaAdd')}
          />
        </View>
        <View style={styles.contentButtonItem}>
          <Button
            raised={false}
            title='Solo para mi'
            buttonStyle={{
              backgroundColor: '#0b445e',
              borderRadius: 30,
              height: 50,
            }}
            titleStyle={{
              fontFamily: 'Poppins-Bold',
              fontSize: 18,
            }}
            onPress={() => {}}
          />
        </View>
      </View>

      <FlatList
        ref={listCargas}
        style={{flex: 1}}
        data={relatives}
        extraData={relatives}
        renderItem={({item, index}: {item: Carga; index: number}) => {
          return (
            <Relative
              key={'ralative' + index}
              name={item.data.name}
              relation={item.data.relationship}
              age={item.data.age}
              onPress={() => {}}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={{height: 5}}></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#f6f7fc',
  },
  header: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    color: '#15193f',
    fontFamily: 'Poppins-SemiBold',
  },
  contentButton: {
    marginVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentButtonItem: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default CargaListScreen;
