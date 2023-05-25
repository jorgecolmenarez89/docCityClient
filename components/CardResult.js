import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal} from 'react-native';
import {Card, Icon, Avatar, Button} from '@rneui/themed';
import {Rating} from 'react-native-ratings';

const textArray = [
  'Traumatologo',
  'Dermatologo',
  'Cardiologo',
  'Internista',
  'Endocrino',
  'Diabetologo',
  'Gineologo',
  'Ginecostetra',
];

const randomNumber = Math.floor(Math.random() * textArray.length);

function CardResult({healtCenter, especialidades}) {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const renderItem = ({item, index}) => (
    <TouchableOpacity onPress={() => selectedDoctor(item)}>
      <View style={styles.row}>
        <Avatar rounded source={getAvatarUrl(item)} />
        <View style={{display: 'flex', marginLeft: 10}}>
          <Text style={styles.rowTitle}>{item.fullName}</Text>
          <Text style={styles.rowText}>{getEspeciality(item)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getEspeciality = doctor => {
    const filter = especialidades.find(e => e.id === doctor.medicalSpecialityId);
    return filter.name;
  };

  const selectedDoctor = doctor => {
    setSelectedUser(doctor);
    setIsOpened(true);
  };

  const getAvatarUrl = doctor => {
    if (doctor.avatarUrl) {
      return {uri: doctor.avatarUrl};
    } else {
      return require('../assets/icon-user.png');
    }
  };

  return (
    <>
      {healtCenter && (
        <Card containerStyle={{width: 300, height: 300}}>
          <Card.Title>{healtCenter.name}</Card.Title>
          <FlatList
            containerStyle={styles.listContainer}
            data={healtCenter.users}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </Card>
      )}

      <Modal statusBarTranslucent={true} animationType='fade' visible={isOpened}>
        {selectedUser && (
          <>
            <View style={{flex: 1}}>
              <View style={styles.modalHeader}>
                <Icon
                  name='close-outline'
                  color='black'
                  size={30}
                  type='ionicon'
                  style={{marginTop: 5, marginRight: 20}}
                  onPress={() => setIsOpened(false)}
                />
              </View>
              <View style={styles.contentImage}>
                <Avatar size={100} rounded source={getAvatarUrl(selectedUser)} />
              </View>
              <View style={styles.centerContent}>
                <Text style={styles.fullNames}>{selectedUser.fullName}</Text>
                <Text style={styles.speciality}>{getEspeciality(selectedUser)}</Text>
                <Text style={styles.speciality}>Credencial: {selectedUser.colegioMedicoId}</Text>
                <Text style={styles.speciality}>
                  Años de experiencia: {selectedUser.experienceYears}
                </Text>
              </View>
              <View style={{...styles.centerContent, marginTop: 20}}>
                <Text style={styles.speciality}>Calificación</Text>
                <Rating
                  startingValue={4}
                  ratingCount={5}
                  imageSize={30}
                  readonly
                  onFinishRating={() => {}}
                />
              </View>
              <View style={styles.info}></View>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: 70,
              }}>
              <View style={{flex: 1, paddingHorizontal: 10}}>
                <Button
                  title='Contactar'
                  onPress={() => {}}
                  buttonStyle={{
                    backgroundColor: '#66bfc5',
                    borderRadius: 10,
                    height: 40,
                  }}
                  titleStyle={{
                    fontFamily: 'Poppins-SemiBold',
                  }}
                  loading={false}
                />
              </View>
              <View style={{flex: 1, paddingHorizontal: 10}}>
                <Button
                  title='Cancelar'
                  onPress={() => setIsOpened(false)}
                  buttonStyle={{
                    backgroundColor: '#66bfc5',
                    borderRadius: 10,
                    height: 40,
                  }}
                  titleStyle={{
                    fontFamily: 'Poppins-SemiBold',
                  }}
                  loading={false}
                />
              </View>
            </View>
          </>
        )}
      </Modal>
    </>
  );
}

export default CardResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
  },
  listContainer: {
    flex: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  rowTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#15193f',
  },
  rowText: {
    fontFamily: 'Poppins-Regular',
    color: '#15193f',
  },
  modalHeader: {
    height: 60,
    display: 'flex',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentImage: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  centerContent: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  fullNames: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#15193f',
  },
  speciality: {
    fontFamily: 'Poppins-Regular',
    color: '#15193f',
    fontSize: 18,
  },
  info: {
    display: 'flex',
    width: '100%',
    paddingHorizontal: 20,
  },
});
