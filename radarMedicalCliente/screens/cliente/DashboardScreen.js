import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import CardSolicitar from '../../components/home/CardSolicitar';
import CardBuscar from '../../components/home/CardBuscar';
import Items from '../../components/home/Items';
import Populares from '../../components/home/Populares';

function DashboardScreen({navigation}) {

  const [populars, setPopulars] = useState([
    {
      name: 'Alexander Zambrano',
      especialidad: 'Traumatólogo',
      valoracion: 5
    },
    {
      name: 'Maria Lugo',
      especialidad: 'Ginecotólogo',
      valoracion: 5
    },
    {
      name: 'Jose Aldana',
      especialidad: 'Cardiólogo',
      valoracion: 5
    }
  ])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.ubicationContainer}>
          <Text>DashboardScreen</Text>
        </View>

        <CardSolicitar />
        <View style={styles.spacer} />
        
        <View style={styles.sectionSeparatpor}>
          <Text style={styles.sectionTitle} >Información de interes</Text>
        </View>

        <Items/>
        <View style={styles.spacer} />
        
        <View style={styles.sectionSeparatpor}>
          <Text style={styles.sectionTitle} >Médicos más populares</Text>
        </View>

				<View style={styles.spacer}></View>

        {populars.map((p, i) => (
          <View style={{ marginBottom: 15 }} key={'popular-'+i} >
            <Populares title={p.name}
              stars={p.valoracion}
              speciality={p.especialidad}
            />
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fc',
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  ubicationContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    marginVertical: 8,
  },
  sectionSeparatpor:{

  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
		fontSize: 16,
    color: '#06060a'
  }
});

export default DashboardScreen;
