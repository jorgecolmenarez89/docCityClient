import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, Alert} from 'react-native';
import {CheckBox, Button} from '@rneui/themed';
import {updateUserInfo} from '../../services/doctor/profile';
import {AuthContext} from '../../context/AuthContext';

function TriajeScreen({navigation}) {
  const {userLoged, changeUserLoged} = useContext(AuthContext);

  const [pregunta1, setPregunta1] = useState('');
  const [pregunta2, setPregunta2] = useState('');
  const [pregunta3, setPregunta3] = useState('');
  const [pregunta4, setPregunta4] = useState('');
  const [pregunta5, setPregunta5] = useState('');
  const [pregunta6, setPregunta6] = useState('');
  const [pregunta7, setPregunta7] = useState('');
  const [pregunta8, setPregunta8] = useState('');
  const [pregunta9, setPregunta9] = useState('');
  const [pregunta10, setPregunta10] = useState('');
  const [pregunta11, setPregunta11] = useState('');
  const [pregunta12, setPregunta12] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleCheckbox1 = (e, value) => {
    setPregunta1(value);
  };

  const toggleCheckbox2 = (e, value) => {
    setPregunta2(value);
  };

  const toggleCheckbox3 = (e, value) => {
    setPregunta3(value);
  };

  const toggleCheckbox4 = (e, value) => {
    setPregunta4(value);
  };

  const toggleCheckbox5 = (e, value) => {
    setPregunta5(value);
  };

  const toggleCheckbox6 = (e, value) => {
    setPregunta6(value);
  };

  const toggleCheckbox7 = (e, value) => {
    setPregunta7(value);
  };

  const toggleCheckbox8 = (e, value) => {
    setPregunta8(value);
  };

  const toggleCheckbox9 = (e, value) => {
    setPregunta9(value);
  };

  const toggleCheckbox10 = (e, value) => {
    setPregunta10(value);
  };

  const toggleCheckbox11 = (e, value) => {
    setPregunta11(value);
  };

  const toggleCheckbox12 = (e, value) => {
    setPregunta12(value);
  };
  const updateData = async () => {
    if (
      pregunta1 == '' ||
      pregunta2 == '' ||
      pregunta3 == '' ||
      pregunta4 == '' ||
      pregunta5 == '' ||
      pregunta6 == '' ||
      pregunta7 == '' ||
      pregunta8 == '' ||
      pregunta9 == '' ||
      pregunta10 == '' ||
      pregunta11 == '' ||
      pregunta12 == ''
    ) {
      Alert.alert('Error', 'Estimado usuario debe responder todas las preguntas');
    } else {
      setLoading(true);
      Alert.alert('Correcto', 'Todo bien');
      /*try {
				const body = {
					userName: userLoged.userName,
					sexo: sex,
					phoneNumber: phone
				}
				await updateUserInfo(body)
				changeUserLoged({
					...userLoged,
					sexo: sex,
					phoneNumber: phone
				})
				setLoading(false); 
				Alert.alert('Exito','Datos actualizados correctamente');
			} catch (error) {
				setLoading(false);
				console.log('error', error.response.data)
				Alert.alert('Error','Ocurrio un error intente nuevamente');
			}*/
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Antes de comenzar debe completar la siguiente información</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>
                ¿Tiene algún problema de salud o diagnostico actualmente?
              </Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta1 === 'si'}
                onPress={e => {
                  toggleCheckbox1(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta1 === 'no'}
                onPress={e => {
                  toggleCheckbox1(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>
                ¿Ha tenido usted una cirugía o procedimiento médico en los ultimos años
              </Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta2 === 'si'}
                onPress={e => {
                  toggleCheckbox2(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta2 === 'no'}
                onPress={e => {
                  toggleCheckbox2(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>¿Toma algúna medicación de manera regular?</Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta3 === 'si'}
                onPress={e => {
                  toggleCheckbox3(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta3 === 'no'}
                onPress={e => {
                  toggleCheckbox3(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>¿Tiene algún tipo de Alergia conocida?</Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta4 === 'si'}
                onPress={e => {
                  toggleCheckbox4(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta4 === 'no'}
                onPress={e => {
                  toggleCheckbox4(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>
                ¿Tiene antecedendes familiares de algúna enfermedad crónica?
              </Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta5 === 'si'}
                onPress={e => {
                  toggleCheckbox5(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta5 === 'no'}
                onPress={e => {
                  toggleCheckbox5(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>
                ¿Realiza algún deporte o actividad física regularmente?
              </Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta6 === 'si'}
                onPress={e => {
                  toggleCheckbox6(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta6 === 'no'}
                onPress={e => {
                  toggleCheckbox6(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>¿Ha notado algún cambio reciente en su peso?</Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta7 === 'si'}
                onPress={e => {
                  toggleCheckbox7(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta7 === 'no'}
                onPress={e => {
                  toggleCheckbox7(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemRadioContainer}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>¿Cauntas Horas duerme promedio cada noche?</Text>
            </View>
            <View style={styles.itemRadio}>
              <CheckBox
                checked={pregunta8 === '0-4-horas'}
                onPress={e => {
                  toggleCheckbox8(e, '0-4-horas');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='De 0 a 4 horas'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta8 === '4-5-horas'}
                onPress={e => {
                  toggleCheckbox8(e, '4-5-horas');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Entre 4 y 5 horas'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta8 === '5-6-horas'}
                onPress={e => {
                  toggleCheckbox8(e, '5-6-horas');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Entre 5 y 6 horas'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta8 === '6-7-horas'}
                onPress={e => {
                  toggleCheckbox8(e, '6-7-horas');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Entre 6 y 7 horas'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta8 === '7-8-horas'}
                onPress={e => {
                  toggleCheckbox8(e, '7-8-horas');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Entre 7 y 8 horas'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta8 === '8-9-horas'}
                onPress={e => {
                  toggleCheckbox8(e, '8-9-horas');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Entre 8 y 9 horas'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta8 === 'mas-9-horas'}
                onPress={e => {
                  toggleCheckbox8(e, 'mas-9-horas');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Más de 9 horas'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>¿Fuma o consume alcohol regularmente?</Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta9 === 'si'}
                onPress={e => {
                  toggleCheckbox9(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta9 === 'no'}
                onPress={e => {
                  toggleCheckbox9(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>
                ¿Ha experimentado algún tipo de dolor o molesti física el los últimos meses?
              </Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta10 === 'si'}
                onPress={e => {
                  toggleCheckbox10(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta10 === 'no'}
                onPress={e => {
                  toggleCheckbox10(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>¿Ha recibido algna vacuna recientemente?</Text>
            </View>
            <View style={styles.itemCheckbox}>
              <CheckBox
                checked={pregunta11 === 'si'}
                onPress={e => {
                  toggleCheckbox11(e, 'si');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: -10,
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={pregunta11 === 'no'}
                onPress={e => {
                  toggleCheckbox11(e, 'no');
                }}
                iconType='material-community'
                checkedIcon='checkbox-outline'
                uncheckedIcon={'checkbox-blank-outline'}
                checkedColor='#0b445e'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                title='No'
                textStyle={{
                  marginRight: 0,
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemRadioContainer}>
            <View style={styles.titleItemContainer}>
              <Text style={styles.textItem}>¿Con qué frecuencia se hace un chequeo médico?</Text>
            </View>
            <View style={styles.itemRadio}>
              <CheckBox
                checked={pregunta12 === 'cada-3-meses'}
                onPress={e => {
                  toggleCheckbox12(e, 'cada-3-meses');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Una vez cada 3 meses'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta12 === 'cada-6-meses'}
                onPress={e => {
                  toggleCheckbox12(e, 'cada-6-meses');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Una vez cada 6 meses'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta12 === 'anual'}
                onPress={e => {
                  toggleCheckbox12(e, 'anual');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Una vez al año'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta12 === 'cuando-es-necesario'}
                onPress={e => {
                  toggleCheckbox12(e, 'cuando-es-necesario');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Solo cuando es necesario'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
              <CheckBox
                checked={pregunta12 === 'nunca'}
                onPress={e => {
                  toggleCheckbox12(e, 'nunca');
                }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='#0b445e'
                title='Nunca lo hago'
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginTop: 3,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title='Guardar Información'
            buttonStyle={{
              backgroundColor: '#0b445e',
              borderRadius: 30,
              height: 50,
            }}
            titleStyle={{
              fontFamily: 'Poppins-SemiBold',
            }}
            onPress={() => {
              updateData();
            }}
            loading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TriajeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fc',
    paddingTop: StatusBar.currentHeight,
  },
  ubicationContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    marginVertical: 8,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#1a1a1a',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 8,
  },
  titleItemContainer: {
    flex: 1,
  },
  textItem: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
  },
  itemRadioContainer: {
    display: 'flex',
  },
  itemCheckbox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRadio: {
    display: 'flex',
  },
  buttonContainer: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
  },
});
