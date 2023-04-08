import React, {useContext} from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PermisionsContext } from '../../context/PermisionsContext';
import BotonBlack from '../../components/BotonBlack';

const PermisionScreen = ({ navigation }) => {

  const { permissions, askLocationPermission } = useContext(PermisionsContext)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Es necesario el uso del GPS para usar esta Aplicación
      </Text>
      <BotonBlack 
        title="Permiso"
        onPress={askLocationPermission}
      />
      <Text style={{marginTop: 20}}>
        { JSON.stringify(permissions, null, 5)}
      </Text>
    </View>
  );
}

export default PermisionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title:{
    width: 250,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  }
})