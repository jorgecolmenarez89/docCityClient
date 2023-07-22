import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, StatusBar, Alert} from 'react-native';
import {CheckBox, Button, Dialog} from '@rneui/themed';
import {AuthContext} from '../context/AuthContext';
import {getTriaje, insertTriaje, updateTriaje} from '../services/doctor/triaje';

function Triaje({idUser, parent}) {
  const {userLoged} = useContext(AuthContext);

  const [answerToQuestion1, setAnswerToQuestion1] = useState('');
  const [answerToQuestion2, setAnswerToQuestion2] = useState('');
  const [answerToQuestion3, setAnswerToQuestion3] = useState('');
  const [answerToQuestion4, setAnswerToQuestion4] = useState('');
  const [answerToQuestion5, setAnswerToQuestion5] = useState('');
  const [answerToQuestion6, setAnswerToQuestion6] = useState('');
  const [answerToQuestion7, setAnswerToQuestion7] = useState('');
  const [answerToQuestion8, setAnswerToQuestion8] = useState('');
  const [answerToQuestion9, setAnswerToQuestion9] = useState('');
  const [answerToQuestion10, setAnswerToQuestion10] = useState('');
  const [answerToQuestion11, setAnswerToQuestion11] = useState('');
  const [answerToQuestion12, setAnswerToQuestion12] = useState('');
  const [loading, setLoading] = useState(false);
  const [triaje, setTriaje] = useState('');
  const [tiene, setTiene] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (idUser) {
      saerchTriaje(idUser);
    } else {
      saerchTriaje(null);
    }
  }, []);

  const saerchTriaje = async userId => {
    setVisible(true);
    const id = userId ? userId : userLoged.id;
    try {
      const {data} = await getTriaje(id);
      setAnswerToQuestion1(data[0].answerToQuestion1);
      setAnswerToQuestion2(data[0].answerToQuestion2);
      setAnswerToQuestion3(data[0].answerToQuestion3);
      setAnswerToQuestion4(data[0].answerToQuestion4);
      setAnswerToQuestion5(data[0].answerToQuestion5);
      setAnswerToQuestion6(data[0].answerToQuestion6);
      setAnswerToQuestion7(data[0].answerToQuestion7);
      setAnswerToQuestion8(data[0].answerToQuestion8);
      setAnswerToQuestion9(data[0].answerToQuestion9);
      setAnswerToQuestion10(data[0].answerToQuestion10);
      setAnswerToQuestion11(data[0].answerToQuestion11);
      setAnswerToQuestion12(data[0].answerToQuestion12);
      setVisible(false);
      setTriaje(data[0]);
      setTiene(true);
    } catch (error) {
      console.log('error', error);
      setTiene(false);
      setVisible(false);
    }
  };

  const toggleCheckbox1 = (e, value) => {
    setAnswerToQuestion1(value);
  };

  const toggleCheckbox2 = (e, value) => {
    setAnswerToQuestion2(value);
  };

  const toggleCheckbox3 = (e, value) => {
    setAnswerToQuestion3(value);
  };

  const toggleCheckbox4 = (e, value) => {
    setAnswerToQuestion4(value);
  };

  const toggleCheckbox5 = (e, value) => {
    setAnswerToQuestion5(value);
  };

  const toggleCheckbox6 = (e, value) => {
    setAnswerToQuestion6(value);
  };

  const toggleCheckbox7 = (e, value) => {
    setAnswerToQuestion7(value);
  };

  const toggleCheckbox8 = (e, value) => {
    setAnswerToQuestion8(value);
  };

  const toggleCheckbox9 = (e, value) => {
    setAnswerToQuestion9(value);
  };

  const toggleCheckbox10 = (e, value) => {
    setAnswerToQuestion10(value);
  };

  const toggleCheckbox11 = (e, value) => {
    setAnswerToQuestion11(value);
  };

  const toggleCheckbox12 = (e, value) => {
    setAnswerToQuestion12(value);
  };

  const getUserId = () => {
    if (parent) {
      return userLoged.id;
    } else {
      if (tiene) {
        return triaje.idUser;
      } else {
        return idUser;
      }
    }
  };

  const updateData = async () => {
    if (
      answerToQuestion1 == '' ||
      answerToQuestion2 == '' ||
      answerToQuestion3 == '' ||
      answerToQuestion4 == '' ||
      answerToQuestion5 == '' ||
      answerToQuestion6 == '' ||
      answerToQuestion7 == '' ||
      answerToQuestion8 == '' ||
      answerToQuestion9 == '' ||
      answerToQuestion10 == '' ||
      answerToQuestion11 == '' ||
      answerToQuestion12 == ''
    ) {
      Alert.alert('Error', 'Estimado usuario debe responder a todas las preguntas');
    } else {
      setLoading(true);
      try {
        let bodyTriaje;
        bodyTriaje = {
          idUser: getUserId(),
          answerToQuestion1,
          answerToQuestion2,
          answerToQuestion3,
          answerToQuestion4,
          answerToQuestion5,
          answerToQuestion6,
          answerToQuestion7,
          answerToQuestion8,
          answerToQuestion9,
          answerToQuestion10,
          answerToQuestion11,
          answerToQuestion12,
        };
        if (tiene) {
          bodyTriaje.id = triaje.id;
          await updateTriaje(bodyTriaje);
        } else {
          await insertTriaje(bodyTriaje);
        }
        setTiene(false);
        setLoading(false);
        Alert.alert('Exito', 'Datos actualizados correctamente');
      } catch (error) {
        setLoading(false);
        console.log('error', error);
        Alert.alert('Error', 'Ocurrio un error intente nuevamente');
      }
    }
  };

  return (
    <View style={styles.container}>
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
                checked={answerToQuestion1 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion1 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion2 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion2 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion3 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion3 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion4 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion4 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion5 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion5 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion6 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion6 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion7 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion7 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion8 === '0-4-horas'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion8 === '4-5-horas'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion8 === '5-6-horas'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion8 === '6-7-horas'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion8 === '7-8-horas'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion8 === '8-9-horas'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion8 === 'mas-9-horas'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion9 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion9 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion10 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion10 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion11 === 'si'}
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
                  backgroundColor: '#f6f7fc',
                }}
                title='Si'
                textStyle={{
                  marginRight: 1,
                  marginLeft: 0,
                }}
              />
              <CheckBox
                checked={answerToQuestion11 === 'no'}
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
                  backgroundColor: '#f6f7fc',
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
                checked={answerToQuestion12 === 'cada-3-meses'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion12 === 'cada-6-meses'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion12 === 'anual'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion12 === 'cuando-es-necesario'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
              <CheckBox
                checked={answerToQuestion12 === 'nunca'}
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
                  backgroundColor: '#f6f7fc',
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title='Guardar información'
            raised={false}
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

        <Dialog isVisible={visible} onBackdropPress={() => {}}>
          <Dialog.Loading />
        </Dialog>
      </ScrollView>
    </View>
  );
}

export default Triaje;

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

  contentView: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
});
