import React, {useState, useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Modal, Dimensions } from 'react-native';
import { Card, Text, FAB, Button, Icon } from '@rneui/themed';
import SingleMap from '../../components/SingleMap';
import MenuButton from '../../components/MenuButton'; 
import { getCenters} from '../../services/doctor/centers';

const windowHeight = Dimensions.get('window').height;

function HealthCentersScreen({ navigation }) {

  const [ubicaciones, setUbicaciones] = useState([])
  const [refreshing, setRefreshing] = useState(true)
  const [showLocation, setShowLocation] =  useState(false)
  const [markers, setMarkers] = useState([])
  const [initialRegion, setInitialRegion] = useState(null)
  
  
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
    const {data} = await getCenters();
    let arrayItems = []
    data.forEach(element => {
      arrayItems.push(buildMarkers(element))
    });
    setUbicaciones(data.reverse());
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
      <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        {/*<View style={styles.contentMap}>
          <SingleMap 
            markers={[arrayMarkers[index]]}
            initialRegion={buildInitialPosition(item)}
            onPress={() => {}}
            onRegionChange={()=>{}}
            onDragEnd={()=>{}}
            draggableMarker={false}
          />
        </View>*/}
        <View style={{ flex: 1 }} >
          <Text style={styles.titleCard}>{item.name}</Text>
          <Text style={styles.textCard}>{item.rif}</Text>
          <Text style={styles.textCard}>{item.address}</Text>
        </View>

        <View style={{ width: 50, display: 'flex', justifyContent: 'center' }}>
          <Icon name="eye-outline" color="#66bfc5" type="ionicon" onPress={() => openMap(item)} />
        </View>
        
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
      </View>
    </Card>
  );

  const handleRefresh =() => {
    getUbicaciones();
  }

  const keyExtractor = (item, index) => index.toString();

  const openMap = (ubication) => {
    const arrayCoordinate = ubication.geoLocation.split('/');
    setInitialRegion({
      latitude: parseFloat(arrayCoordinate[0]),
      longitude: parseFloat(arrayCoordinate[1]),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    })
    setMarkers([
      {
        image: require('../../assets/custom-marker.png'),
        coordinate: {
          latitude: parseFloat(arrayCoordinate[0]),
          longitude: parseFloat(arrayCoordinate[1]),
        },
        title: ubication.Name,
        description: ubication.Address
      }
    ])
    setShowLocation(true)
  }

  return (
    <View style={{ flex: 1, width: '100%', paddingBottom: 40}}>
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

        <Modal
					statusBarTranslucent={true}
					animationType="fade"
					visible={showLocation}
				>

          <View style={{ flex: 1 }}>
						<View style={styles.modalHeader}>
              <Icon 
								name="close-outline"
								color="black"
								size={27}
								type="ionicon"
								style={{ marginTop: 5, marginRight: 20}}
								onPress={() => setShowLocation(false) }
							/> 
            </View>
            <View style={styles.contentMap}>
							<SingleMap 
								markers={markers}
								onPress={() => {}}
								onRegionChange={()=>{}}
								onDragEnd={() => {}}
								initialRegion={initialRegion}
								draggableMarker={false}
							/>
						</View>
          </View>

        </Modal>


      <FAB
        visible={true}
        upperCase
        icon={{ name: 'add', color: 'white' }}
        placement="right"
        onPress={() => {
          navigation.push("edithealthcenter");
        }}
        color="#66bfc5"
      />
    </View>
  );
}

export default HealthCentersScreen

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
  },
  modalHeader:{
		height: 60,
		display: 'flex',
    flexDirection: 'row',
		paddingHorizontal: 20,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
  contentMap:{
		height: windowHeight - 20,
	},
})