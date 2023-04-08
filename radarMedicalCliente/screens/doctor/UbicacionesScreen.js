import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, FAB, Button, Icon } from '@rneui/themed';
import SingleMap from '../../components/SingleMap';
import { eliminarUbicacion, mostrarUbicaciones } from '../../services/doctor/ubicaciones';
import MenuButton from '../../components/MenuButton'; 
import { getCenters, getCentersByUser} from '../../services/doctor/centers';

function UbicacionesScreen({ navigation }) {

  const [ubicaciones, setUbicaciones] = useState([])
  const [refreshing, setRefreshing] = useState(true)
  const [arrayMarkers, setArrayMarkers] =  useState([])
  
  useEffect(() =>{
    getUbicaciones();
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      getUbicaciones();
      return () => null;
    }, [])
  );

  const getUbicaciones = async() => {
    let userToken = await AsyncStorage.getItem('userToken');
    const userData = JSON.parse(userToken);
    const {data} = await getCentersByUser(userData.userName);
    let arrayItems = []
    data.forEach(element => {
      arrayItems.push(buildMarkers(element))
    });
    setArrayMarkers(arrayItems)
    setUbicaciones(data);
    setRefreshing(false)
  }

  const buildMarkers = (ubication) => {
    const arrayCoordinate = ubication.geoLocation.split('/');
    const result = {
      image: require('../../assets/custom-marker.png'),
      coordinate: {
        latitude: parseFloat(arrayCoordinate[0]),
        longitude: parseFloat(arrayCoordinate[1]),
      },
      title: ubication.Name,
      description: ubication.Address
    }
    return result
  }

  const buildInitialPosition = (ubication) => {
    const arrayCoordinate = ubication.geoLocation.split('/');
    return {
      latitude: parseFloat(arrayCoordinate[0]),
      longitude: parseFloat(arrayCoordinate[1]),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  }

  const deleteUbicacion = (ubication) => {

  }

  const editarUbicacion = (ubication) => {
    navigation.push("editubicacion", {
      item: ubication,
    });
  }

  const renderItem = ({ item, index }) => (
    <Card>
      <View style={styles.contentMap}>
        <SingleMap 
          markers={[arrayMarkers[index]]}
          initialRegion={buildInitialPosition(item)}
          onPress={() => {}}
          onRegionChange={()=>{}}
          onDragEnd={()=>{}}
          draggableMarker={false}
        />
      </View>
      <Text style={styles.titleCard}>{item.name}</Text>
      <Text style={styles.textCard}>{item.rif}</Text>
      <Text style={styles.textCard}>{item.address}</Text>
      
      {/*<Card.Divider  style={{marginTop: 5}}/>
      <View style={styles.contentActions}>

        <Button radius={'sm'} type="solid"
          containerStyle={{
            marginRight: 5
          }}
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: '#66bfc5',
          }}
          onPress={() => editarUbicacion(item)}
        >
          <Icon name="edit" color="white" size={20} />
        </Button>

        <Button radius={'sm'} type="solid"
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: '#66bfc5',
          }}
          onPress={() => eliminarUbicacion(item)}
        >
          <Icon name="trash" color="white" type="ionicon" size={20}  />
        </Button>
        
      </View>*/}
    </Card>
  );

  const handleRefresh =() => {
    getUbicaciones();
  }

  const keyExtractor = (item, index) => index.toString();

  return (
    <View style={{ flex: 1, width: '100%'}}>
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
        
      <FlatList
        keyExtractor={keyExtractor}
        data={ubicaciones}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />


      <FAB
        visible={true}
        upperCase
        icon={{ name: 'add', color: 'white' }}
        placement="left"
        onPress={() => {
          navigation.push("editubicacion");
        }}
        color="#66bfc5"
      />
    </View>
  );
}

export default UbicacionesScreen

const styles = StyleSheet.create({ 
  container:{
    flex: 1,
  },
  contentMap:{
    width: '100%',
    height: 180,
    marginTop: 10
  },
  contentActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  titleCard: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textCard:{
    fontSize: 14,
    fontWeight: 'bold',
  }
})